export default function handler(req, res) {
  if (req.method === "GET") {
    // Simulate returning a mocked plan document
    res.status(200).json({
      plan: { learning_plan: { aim: "Mocked Aim", weeks: [] } },
      createdAt: new Date(),
      userId: "mocked-user-id",
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}