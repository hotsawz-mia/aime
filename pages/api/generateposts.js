// this works if you want to check its connection with OpenAI

// import { OpenAIApi, Configuration} from "openai";

// export default async function handler(req, res) {
//     const config = new Configuration({
//         apiKey: process.env.OPENAI_API_KEY,
//     });

//     const openai = new OpenAIApi(config);

//     const goal = "Sing in a rock band";
//     const keywords= "first-time singer, rock band, music venue";

//     const response = await openai.createChatCompletion({
//         model: "gpt-4.1",
//         messages:[{
//             role: "system", //where the message comes from
//             content: "Welcome to Aime. Designed to help you succeed"
//         },
//         {
//             role:"user", // this is the users prompt
//             content: `"Generate me 6 month weekly plan on the following Aim: ${goal}"`
//         } ],
//     });

//     const content = response.data.choices[0]?.message?.content;
//     res.status(200).json({ content });
// }


// this works but will not return any data as there is no form connected yet
import { OpenAIApi, Configuration } from "openai";

export default async function handler(req, res) {
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(config);

    // grab form data from request body
    const {
        aim,
        success,
        startingLevel,
        targetDate,
        timePerDay
    } = req.body;

    const response = await openai.createChatCompletion({
        model: "gpt-4.1",
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

    // try parsing AI response as JSON
    let plan;
    try {
        plan = JSON.parse(content);
    } catch (error) {
        // fallback in case AI doesn't return valid JSON
        plan = { error: "Failed to parse AI response as JSON", raw: content };
    }

    res.status(200).json({ plan });
}

