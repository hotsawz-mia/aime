// pages/api/saveprogress.js
import clientPromise from "../../lib/mongodb";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  console.log("Inside handler in saveProgress", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("aime");
    const { userId } = getAuth(req);

    console.log("UserId from Clerk in saveProgress:", userId);
    console.log("Request body:", req.body);
    console.log("Activity:", req.body.learning_plan.weeks[0]);

    // TODO: persist progress in db, e.g. db.collection("plans").updateOne(...)

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("saveProgress error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}