import clientPromise from "../../lib/mongodb";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get the authenticated user
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("aime");
    
    const userPlans = await db.collection("plans")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ plans: userPlans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
}