// Receives POST data from a frontend form.
// Uses form data to generate a prompt for OpenAI.
// Parses the OpenAI response as JSON.
// Saves the plan and Clerk user ID to MongoDB.
// Returns the new plan’s ID to the frontend.
import clientPromise from "../../lib/mongodb";
import { getAuth } from "@clerk/nextjs/server";
import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
    if (req.method === "POST") {
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(config);
    const client = await clientPromise;
    const db = client.db("aime");
    const plans = db.collection("plans");
    const { userId } = getAuth(req);

    // grab form data from request body - based on Client form
    const {
        aim,
        success,
        startingLevel,
        targetDate,
        timePerDay
    } = req.body;

    // hardcoded for testing

    // const aim = "Sing in a rock band";
    // const success = "Perform at a local venue confidently";
    // const startingLevel = "Beginner with no stage experience";
    // const targetDate = "2025-12-31";
    // const timePerDay = "1 hour";

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful skill development coach. You create structured, step-by-step learning plans in JSON format."
            },
            {
                role: "user",
                content: `
Here is my information:
- Aim: ${aim}
- Success looks like: ${success}
- Starting level: ${startingLevel}
- Target date: ${targetDate}
- Time available per day: ${timePerDay}

Please generate a personalized learning plan in JSON format. 
Structure it by weeks (or steps if more appropriate), and for each week include:
- objectives
- activities
- tips
Make sure the JSON is valid and parseable.
`
            }
        ],
    });
    const content = response.data.choices[0]?.message?.content;

    // Remove code block markers if present
let cleanedContent = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();
    // Try to parse the response as JSON
    let plan;
    try {
      plan = JSON.parse(cleanedContent);
    } catch (e) {
      return res.status(500).json({ error: "OpenAI did not return valid JSON", content });
    }

    // Insert the plan into MongoDB
    const result = await plans.insertOne({
      plan,
      createdAt: new Date(),
    //   coming from Clerk server side
      userId
    });


    res.status(200).json({ id: result.insertedId });
  } else {
    res.status(405).json({ message: "Method not allowed" });

  }
}

