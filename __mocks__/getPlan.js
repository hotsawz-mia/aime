export default function handler(req, res) {
  if (req.method === "POST") {
    // Simulate a successful response with a mock plan ID
    res.status(200).json({ id: "mocked-plan-id" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}