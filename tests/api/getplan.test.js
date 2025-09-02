import { expect } from "@jest/globals";
import handler from "../../pages/api/getplan"; // the real handler

// --- 1. Mock Clerk ---
jest.mock("@clerk/nextjs/server", () => ({
    getAuth: jest.fn(() => ({ userId: "mocked-user-id" })),
}));
        // jest.fn() is a mock function

// --- 2. Mock OpenAI ---
const mockCreateChatCompletion = jest.fn();
jest.mock("openai", () => {
    return {
        Configuration: jest.fn(),
        OpenAIApi: jest.fn(() => ({
        createChatCompletion: mockCreateChatCompletion,
        })),
    };
});

// --- 3. Mock Mongo ---
const mockInsertOne = jest.fn();
jest.mock("../../lib/mongodb", () => ({
    __esModule: true,
    default: Promise.resolve({
        db: () => ({
        collection: () => ({
            insertOne: mockInsertOne,
        }),
        }),
    }),
}));

describe("POST /api/getplan", () => {
    let req, res;

    beforeEach(() => {
        req = {
        method: "POST",
        body: {
            aim: "Learn guitar",
            success: "Play one song",
            startingLevel: "Beginner",
            targetDate: "2025-12-31",
            timePerDay: "30",
        },
        };
        res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        };

        // Reset mocks
        mockCreateChatCompletion.mockReset();
        mockInsertOne.mockReset();

        // Mock MongoDB insertOne to return a valid result
        mockInsertOne.mockResolvedValue({insertedId: "mocked-plan-id"})

        // Suppress console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore console.error
    });

    // -- Test 1 -- 

    test("returns 502 if OpenAI API call fails", async () => {
        // Mock OpenAI API failure
        mockCreateChatCompletion.mockRejectedValue(new Error("OpenAI API error"));

        await handler(req, res);

        expect(mockCreateChatCompletion).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(502);
        expect(res.json).toHaveBeenCalledWith({
            error: "Upstream AI service failed",
        });
    });


    // -- Test 2 --

    test("returns 400 if required fields are missing", async () => {
        req.body = {}; // invalid input

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
        error: "All fields are required",
        });
    });

    // -- Test 3 --

    test("returns 200 with inserted plan ID", async () => {
        // Mock OpenAI response
        mockCreateChatCompletion.mockResolvedValue({
        data: {
            choices: [
            {
                message: {
                content: `{
                    "learning_plan": {
                    "aim": "Learn guitar",
                    "success_criteria": "Play one song",
                    "starting_level": "Beginner",
                    "target_date": "2025-12-31",
                    "time_per_day": 30,
                    "weeks": [
                        { "week_number": 1, "objectives": ["Learn chords"], "activities": ["Practice"], "tips": ["Stay consistent"] }
                    ]
                    }
                }`,
                },
            },
            ],
        },
        });

    // Mock Mongo insert
    mockInsertOne.mockResolvedValue({ insertedId: "mocked-plan-id" });

    await handler(req, res);

    expect(mockCreateChatCompletion).toHaveBeenCalled();
    expect(mockInsertOne).toHaveBeenCalledWith(
        expect.objectContaining({
            plan: expect.any(Object),
            createdAt: expect.any(Date),
            userId: "mocked-user-id",
        })
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: "mocked-plan-id" });
    });

    // -- Test 4--

    test("returns the parsed mock plan document in the DB insert", async () => {
    const mockPlanContent = `{
        "learning_plan": {
            "aim": "Learn guitar",
            "success": "Play one song",
            "startingLevel": "Beginner",
            "targetDate": "2025-12-31",
            "timePerDay": "30",
            "weeks": [
                { "weekNumber": 1, "objectives": ["Learn chords"], "activities": ["Practice"], "tips": ["Stay consistent"] }
            ]
        }
    }`;

    // Mock OpenAI response
    mockCreateChatCompletion.mockResolvedValue({
        data: {
            choices: [
                { message: { content: mockPlanContent } }
            ],
        },
    });

    // Mock Mongo insert
    mockInsertOne.mockResolvedValue({ insertedId: "mocked-plan-id" });

    await handler(req, res);

    // Verify OpenAI was called
    expect(mockCreateChatCompletion).toHaveBeenCalled();

    // Verify DB insert contained the parsed plan
    expect(mockInsertOne).toHaveBeenCalledWith(
        expect.objectContaining({
            plan: JSON.parse(mockPlanContent), // check actual parsed doc
            createdAt: expect.any(Date),
            userId: "mocked-user-id",
        })
    );

    // Verify response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: "mocked-plan-id" });
});

    // -- Test 5 --

    test("returns 502 if OpenAI response content is empty or invalid", async () => {
        // Case 1: Empty content
        mockCreateChatCompletion.mockResolvedValue({
            data: {
                choices: [
                    { message: { content: "" } }, // Empty string
                ],
            },
        });

        await handler(req, res);

        expect(mockCreateChatCompletion).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(502);
        expect(res.json).toHaveBeenCalledWith({
            error: "OpenAI response content is empty or invalid",
        });

     // Reset mocks for next case
    mockCreateChatCompletion.mockReset();
    
    // Case 2: Non-string content
    mockCreateChatCompletion.mockResolvedValue({
        data: {
            choices: [
                {message: {content: 12345}}, // Non-string value
            ],
        },
    });

    await handler(req, res);

    expect(mockCreateChatCompletion).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
        error:"OpenAI response content is empty or invalid",
    });

    // Reset mocks for the next case
    mockCreateChatCompletion.mockReset();


    // Case 3: Whitespace content

    mockCreateChatCompletion.mockResolvedValue({
        data: {
            choices: [
                {message: { content: "  "}}, // whitespace content
            ],
        },
    });

    await handler(req, res);

    expect(mockCreateChatCompletion).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
        error: "OpenAI response content is empty or invalid"
        });
    });
    


    // -- Test 6 -- mongodb insert failure

    test("returns 405 if MongoDB insert fails", async () => {
        //Mock OpenAI response
        mockCreateChatCompletion.mockResolvedValue({
            data:{
                choices:[{
                    message: {
                        content: `{
                        "learning_plan": {
                        "aim": "Learn guitar",
                        "success_criteria": "Play one song",
                        "starting_level": "Beginner",
                        "target_date": "2025-12-31",
                        "time_per_day": 30,
                        "weeks":[]
                        }
                    }`,
                    },
                }],
            },
        });

    // Mock MongoDB insert failure
    mockInsertOne.mockRejectedValue(new Error(" Method not allowed"));

    await handler(req, res);

    expect(mockCreateChatCompletion).toHaveBeenCalled();
    expect(mockInsertOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
        error: "Database insert failed",
        });
    });
});

