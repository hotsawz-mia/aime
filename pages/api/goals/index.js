module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!req.headers["content-type"]?.includes("application/json")) {
    return res.status(400).json({ error: "Expected application/json" });
  }

  try {
    const { aime, success, startLevel, targetDate, timePerDay } = req.body || {};
    if (!aime || !success || !targetDate) {
      return res
        .status(400)
        .json({ error: "Missing required fields: aime, success, targetDate" });
    }

    const hasKey = !!process.env.OPENAI_API_KEY;

    // Steps 1–2: without a key, just echo back
    if (!hasKey) {
      return res.status(200).json({
        id: Date.now().toString(),
        plan: null,
        echo: {
          aime,
          success,
          startLevel: startLevel || null,
          targetDate,
          timePerDay: timePerDay || null,
        },
        note: "OpenAI disabled: set OPENAI_API_KEY to enable LLM call.",
      });
    }

    // Only import OpenAI when needed; fine inside CommonJS with dynamic import
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `The user has an aim: ${aime}.
They define success as: ${success}.
They are starting from: ${startLevel || "not specified"}.
They want to achieve this by: ${targetDate}.
They can commit about ${timePerDay || "unspecified"} minutes per day.

Create a motivating and structured plan for them.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const plan = completion.choices?.[0]?.message?.content || "";
    return res.status(200).json({ id: Date.now().toString(), plan });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};