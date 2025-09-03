// see this version of my endpoint:  /api/activitystatus

import clientPromise from "../../lib/mongodb";
import { getAuth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

export default async function handler(req,res){
    console.log("ActivityStatus API hit");
    console.log("Request body:", req.body); // Log the incoming request body

    if (req.method !== "PATCH") {
        return res.status(405).json({error: "Method not allowed"});
    }

    try {
    const { planId, checkboxId, isChecked } = req.body;

    if (!planId || !checkboxId || typeof isChecked !== "boolean") {
      console.log("Validation failed: Missing or invalid fields"); // Log validation failure
        return res.status(400).json({ error: "Missing or invalid fields" });
    }

    const { userId } = getAuth(req);
    console.log("UserId from Clerk:", userId); // Log userId from Clerk
    if (!userId) {
      console.log("Unauthorized access attempt"); // Log unauthorized access
        return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("aime");
    const plans = db.collection("plans");

    console.log("planId:", planId, "userId:", userId, "checkboxId:", checkboxId, "isChecked:", isChecked); // Log all key variables

    // Parse the checkboxId to get weekNumber and activityIndex
    const [weekNumber, activityIndex] = checkboxId.split("-").map(Number);

    console.log("Updating checkbox state in database...");
    const result = await plans.updateOne(
    { _id: new ObjectId(planId), userId }, // Match the document by planId and userId
    {
        $set: {
        [`plan.learning_plan.weeks.${weekNumber - 1}.activities.${activityIndex}.completed`]: isChecked, // Update the specific activity's completed field
        },
    }
    );
    console.log("Update result:", result); // Log the result of the update operation

    if (result.modifiedCount === 0) {
      console.log("No changes made to the document"); // Log if no changes were made
        return res.status(404).json({ error: "Plan not found or no changes made" });
    }

    console.log("Checkbox state updated successfully"); // Log success
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error updating checkbox:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}