// this file is to test the ability to save data to db from a post
// request and return the planID to the front end

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const client = await clientPromise;
    const db = client.db("aime");
    const plans = db.collection("plans");

    // Hardcoded fake OpenAI response
    const fakePlan = {
      plan: {
        learning_plan: {
          start_date: "2021-01-01",
          target_date: "2025-12-31",
          time_available_per_day: "1 hour",
          weeks: [
            {
              week_number: 1,
              objectives: ["Understand basic vocal techniques"],
              activities: [
                "Watch online tutorials on vocal warm-ups and exercises",
                "Practice scales and breathing exercises daily"
              ],
              tips: [
                "Stay hydrated to maintain vocal health",
                "Record yourself singing to track progress"
              ]
            },
            {
              week_number: 2,
              objectives: ["Learn how to control pitch and tone"],
              activities: [
                "Focus on hitting and sustaining notes accurately",
                "Practice singing along with favorite rock songs"
              ],
              tips: [
                "Listen to the original recordings to mimic pitch and tone",
                "Experiment with different vocal styles"
              ]
            },
            {
              week_number: 3,
              objectives: ["Build confidence in singing in front of others"],
              activities: [
                "Sing in front of friends or family members",
                "Participate in a virtual open mic night"
              ],
              tips: [
                "Start with smaller audiences to ease into performing",
                "Focus on expressing emotions through your singing"
              ]
            },
            {
              week_number: 4,
              objectives: ["Improve stage presence and movement"],
              activities: [
                "Watch live performances of rock bands to study stage presence",
                "Practice moving and interacting with an imaginary audience"
              ],
              tips: [
                "Use gestures and body language to engage the audience",
                "Practice performing in front of a mirror to observe your movements"
              ]
            },
            {
              week_number: 5,
              objectives: ["Work on memorizing lyrics and stage banter"],
              activities: [
                "Create lyric sheets and practice memorization techniques",
                "Develop stage banter scripts and practice improvisation"
              ],
              tips: [
                "Break down lyrics into smaller sections for easier memorization",
                "Rehearse stage banter to sound natural and confident"
              ]
            },
            {
              week_number: 6,
              objectives: ["Prepare and rehearse a setlist of rock songs"],
              activities: [
                "Select songs that showcase your vocal range and style",
                "Practice singing the setlist in sequence with pauses for transitions"
              ],
              tips: [
                "Focus on creating a cohesive setlist with varied dynamics",
                "Record yourself performing the setlist to evaluate performance"
              ]
            },
            {
              week_number: 7,
              objectives: ["Refine performance skills and stage presence"],
              activities: [
                "Rehearse the setlist with a focus on performance aspects",
                "Seek feedback from peers or a vocal coach"
              ],
              tips: [
                "Experiment with microphone techniques for different vocal effects",
                "Visualize a successful performance to boost confidence"
              ]
            },
            {
              week_number: 8,
              objectives: ["Perform a mini-concert for friends or family"],
              activities: [
                "Organize a small performance at home or in a backyard setting",
                "Showcase your setlist with stage presence and interaction"
              ],
              tips: [
                "Create a cozy atmosphere with lighting and decorations",
                "Ask for honest feedback to improve further"
              ]
            },
            {
              week_number: 9,
              objectives: ["Overcome stage fright and nerves"],
              activities: [
                "Practice mindfulness and relaxation techniques before performing",
                "Visualize successful performances and positive outcomes"
              ],
              tips: [
                "Focus on your breathing to calm nerves before going on stage",
                "Remind yourself that mistakes are part of the learning process"
              ]
            },
            {
              week_number: 10,
              objectives: ["Prepare for a local venue performance"],
              activities: [
                "Research local venues and open mic nights to participate in",
                "Plan your setlist and rehearse with a focus on live performance"
              ],
              tips: [
                "Communicate with the venue to understand performance logistics",
                "Attend local live music events to observe and learn from other performers"
              ]
            }
          ]
        }
      },
      createdAt: new Date(),
      userId: "test-user-id"
    };

    const result = await plans.insertOne(fakePlan);

    res.status(200).json({ id: result.insertedId });
  } else {
    res.status(405).json({ message: "Method not allowed" });

  }
}