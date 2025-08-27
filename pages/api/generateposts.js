import { OpenAIApi, Configuration} from "openai";

export default async function handler(req, res) {
    const config = new Configuration({
        apiKey: process.env.OpenAI_API_KEY,
    });

    const openai = new OpenAIApi(config);

    const topic = "dog ownership";
    const keywords= "first-time dog owner, puppy diet";

    const response = await openai.createChatCompletion({
        model: "gpt-4.1-2025-04-14",
        messages:[{
            role: "system", //where the message comes from
            content: "You are an SEO friendly blog post generator called Aime. You are designed..."
        },
        {
            role:"user",
            content: `"Generate me a blog post on the following topic: ${topic}"`
        } ],
    });

    console.log(response.data.choices[0]?.message?.content);

    res.status(200).json({ name: 'Generate post' });
}