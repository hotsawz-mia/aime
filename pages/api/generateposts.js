import { OpenAIApi, Configuration} from "openai";

export default async function handler(req, res) {
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(config);

    const goal = "Sing in a rock band";
    const keywords= "first-time singer, rock band, music venue";

    const response = await openai.createChatCompletion({
        model: "gpt-4.1",
        messages:[{
            role: "system", //where the message comes from
            content: "Welcome to Aime. Designed to help you succeed"
        },
        {
            role:"user",
            content: `"Generate me 6 month weekly plan on the following Aim: ${goal}"`
        } ],
    });

    const content = response.data.choices[0]?.message?.content;
    res.status(200).json({ content });
}
