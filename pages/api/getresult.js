import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const client = await clientPromise;
    const db = client.db("aime");
    const plans = db.collection("plans");
    const planDoc = await plans.findOne({ _id: new ObjectId(id) });

    if (!planDoc) return res.status(404).json({ error: "Plan not found" });
    res.status(200).json(planDoc); // returns the whole document
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}