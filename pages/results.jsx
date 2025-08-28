// pages/results.jsx
import { useState, useEffect } from "react";

// Accordion Component - dynamically shows the month / week the user is in
function Accordion({ title, children, openDefault = false }) {
  const [isOpen, setIsOpen] = useState(openDefault);
  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "20px",
          background: "#f0f0f0",
          padding: "8px",
          borderRadius: "6px"
        }}
      >
        {title} {isOpen ? "▲" : "▼"}
      </div>
      {isOpen && <div style={{ padding: "10px" }}>{children}</div>}
    </div>
  );
}

const Results = () => {
  const [results, setResults] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null); // for tracking where the user is in their journey
  const [currentWeek, setCurrentWeek] = useState(null); // for styling purposes mainly, to highlight to the user where they are in their journey
  const [currentDayIndex, setCurrentDayIndex] = useState(null); // see above


  useEffect(() => {
    // Simulated fetch from database
    const fetchData = async () => {
      const fakeData = {
        userId: "xyz789",
        startDate: "2025-08-28", // YYYY-MM-DD - this would have to come from the DB and be a variable that sets to when the user enters "confirm"
        dailyByMonth: {
          // by month, daily schedule for every week of that month, daily schedule changes from month 1 -6 
          "1": [
            { step: "Warm-up", time: "5 min", content: "Lip trills, sirens, humming, gentle scales. Focus on breath support and relaxation." },
            { step: "Technique", time: "10 min", content: "Exercises for vocal range, breath control, resonance, and pitch accuracy." },
            { step: "Song Practice", time: "10 min", content: "Learn and rehearse 2–3 rock songs line by line, focusing on pitch, phrasing, and emotional delivery." },
            { step: "Cooldown", time: "5 min", content: "Gentle humming or descending scales to relax vocal cords." }
          ],
          "2": [
            { step: "Warm-up", time: "5 min", content: "Extend warmups slightly for range expansion." },
            { step: "Technique", time: "10 min", content: "Introduce controlled grit/distortion, stamina building." },
            { step: "Song Practice", time: "10 min", content: "Work on building a setlist of 4–5 songs, sing with karaoke/instrumental tracks." },
            { step: "Cooldown", time: "5 min", content: "Release tension from grit with gentle humming/scales." }
          ],
          "3": [
            { step: "Warm-up", time: "5 min", content: "Full range sirens, build stamina with breath control." },
            { step: "Technique", time: "10 min", content: "Work on sustaining notes, practice endurance with grit." },
            { step: "Song Practice", time: "10 min", content: "Perform full songs start-to-finish, aiming for a 6–7 song setlist." },
            { step: "Cooldown", time: "5 min", content: "Gentle humming and scales to release tension." }
          ],
          "4": [
            { step: "Warm-up", time: "5 min", content: "Pre-band style warmup: quick but effective." },
            { step: "Technique", time: "10 min", content: "Work with dynamics (soft/loud, clean/gritty)." },
            { step: "Song Practice", time: "10 min", content: "Rehearse 7–8 songs in setlist order, simulate live transitions." },
            { step: "Cooldown", time: "5 min", content: "Recovery cooldown after extended practice." }
          ],
          "5": [
            { step: "Warm-up", time: "5 min", content: "Fast, efficient warmup (gig-prep style)." },
            { step: "Technique", time: "10 min", content: "Maintain control, light exercises only." },
            { step: "Song Practice", time: "10 min", content: "Run entire setlist 2–3x per week, focus on stamina and stage interaction." },
            { step: "Cooldown", time: "5 min", content: "Strict cooldown and vocal recovery after long sessions." }
          ],
          "6": [
            { step: "Warm-up", time: "5 min", content: "Exact warmup you’ll use before the show." },
            { step: "Technique", time: "10 min", content: "Minimal – maintenance only, keep voice fresh." },
            { step: "Song Practice", time: "10 min", content: "Simulate full live performance including crowd talk and movement." },
            { step: "Cooldown", time: "5 min", content: "Always cool down after rehearsals/gig to prevent fatigue." }
          ]
        },
        weekly: [
          { day: "Day 1–5", content: "Follow daily routine." },
          { day: "Day 6", content: "Creative/performance practice – sing full songs as if on stage, record yourself to review." },
          { day: "Day 7", content: "Reflection/rest – light humming or skip singing, listen to live performances, take notes." }
        ],
        monthly: [
          { month: "Month 1", content: "Foundations – build consistent routine, identify vocal range, learn 2–3 songs, record weekly." },
          { month: "Month 2", content: "Expanding skills – add grit, stamina exercises, 4–5 song setlist, karaoke versions, basic mic technique." },
          { month: "Month 3", content: "Confidence & repertoire – perform full songs, expand to 6–7 songs, focus on performance energy, start networking." },
          { month: "Month 4", content: "Band readiness – rehearse with backing tracks, build 7–8 song setlist, learn stage cues and endurance." },
          { month: "Month 5", content: "Rehearsal & live prep – rehearse with band (or simulate), practice crowd interaction, sing full setlist 2–3x weekly, confirm venue." },
          { month: "Month 6", content: "Performance mode – rehearse regularly, refine stage presence, perform mock concert, finish with first live gig." }
        ]
      };

      // Calculate current month based on startDate / month/day/week
      const start = new Date(fakeData.startDate); // see code below commented out - this is using the fake mock data - this line would need to be deleted in final code

      //const start = new Date(results.startDate); // ✅ comes from DB
      //const now = new Date(); // ✅ THESE TWO LINES OF CODE ARE FOR THE REAL FINAL CODE THAT DOESNT USE MOCKING

      // future date simulated in these next two lines of code - to shown that the frontend is dynamic - dev tool, not to be included in final code!!!!!!!!
      const simulateDate = new Date("2025-10-16"); // 👈 pick any date you want at it will render a different schedule on the page
      const now = simulateDate;
      // end simulation
      const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      const weekNum = Math.floor(diffDays / 7) + 1; // current week #
      const dayNum = (diffDays % 7); 

      const diffMonths = 
        (now.getFullYear() - start.getFullYear()) * 12 + 
        (now.getMonth() - start.getMonth());
      const totalMonths = Object.keys(fakeData.dailyByMonth).length; // fake data would be replaced by real data
      const current = Math.min(totalMonths, Math.max(1, diffMonths + 1));
      
      setCurrentMonth(current);
      setCurrentWeek(weekNum);
      setCurrentDayIndex(dayNum);
      setResults(fakeData);
    };

    fetchData();
  }, []);

  if (!results) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Aime Breakdown</h1>
      <p>
        Current Month: {currentMonth} | Current Week: {currentWeek} | Day {" "}
        {currentDayIndex + 1}
      </p>

      {/* Daily Schedule Section */}
      <Accordion title="Daily Schedule" openDefault={true}>
        {Object.entries(results.dailyByMonth).map(([month, steps]) => {
          const isCurrent = parseInt(month) === currentMonth;

          if (isCurrent) {
            let dailyContent;

            if (currentDayIndex < 5) {
              // Day 1–5 → show normal daily routine
              dailyContent = steps.map((item, i) => (
                <div key={i} style={{ marginBottom: "10px" }}>
                  <h3 style={{ fontSize: "18px", margin: "4px 0" }}>
                    {item.step} ({item.time})
                  </h3>
                  <p style={{ margin: 0 }}>{item.content}</p>
                </div>
              ));
            } else if (currentDayIndex === 5) {
              // Day 6 → weekly performance day
              dailyContent = (
                <p style={{ fontSize: "16px" }}>{results.weekly[1].content}</p>
              );
            } else {
              // Day 7 → weekly rest/reflection day
              dailyContent = (
                <p style={{ fontSize: "16px" }}>{results.weekly[2].content}</p>
              );
            }

            return (
              <div
                key={month}
                style={{
                  marginBottom: "20px",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "#2dbff087"
                }}
              >
                <h2 style={{ fontSize: "22px", margin: "10px 0" }}>
                  Day {currentDayIndex + 1} of Week {currentWeek} (Month {month} - Current)
                </h2>
                {dailyContent}
              </div>
            );
          }

          // Non-current months stay collapsed
          return (
            <Accordion key={month} title={`Month ${month}`}>
              {steps.map((item, i) => (
                <div key={i} style={{ marginBottom: "10px" }}>
                  <h3 style={{ fontSize: "18px", margin: "4px 0" }}>
                    {item.step} ({item.time})
                  </h3>
                  <p style={{ margin: 0 }}>{item.content}</p>
                </div>
              ))}
            </Accordion>
          );
        })}
      </Accordion>


      {/* Weekly Schedule that can be expanded */}
      <Accordion title="Weekly Schedule">
        {results.weekly.map((item, i) => {
          if (item.day === "Day 1–5") {
            // Expand into 5 separate days
            return (
              <div key={i}>
                {[...Array(5)].map((_, dayIdx) => {
                  const isCurrent = currentDayIndex === dayIdx; // highlight Mon–Fri
                  return (
                    <div
                      key={dayIdx}
                      style={{
                        marginBottom: "10px",
                        padding: "10px",
                        borderRadius: "6px",
                        background: isCurrent ? "#ce74f164" : "transparent"
                      }}
                    >
                      <h3 style={{ fontSize: "18px", margin: "4px 0" }}>
                        Day {dayIdx + 1} {isCurrent && "(Today)"}
                      </h3>
                      <p style={{ margin: 0 }}>{item.content}</p>
                    </div>
                  );
                })}
              </div>
            );
          }

          // Normal Day 6 or Day 7
          const isCurrent = currentDayIndex === i + 4; // maps index properly after Day 1–5
          return (
            <div
              key={i}
              style={{
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "6px",
                background: isCurrent ? "#fdfd7040" : "transparent"
              }}
            >
              <h3 style={{ fontSize: "18px", margin: "4px 0" }}>
                {item.day} {isCurrent && "(Today)"}
              </h3>
              <p style={{ margin: 0 }}>{item.content}</p>
            </div>
          );
        })}
      </Accordion>

      {/* Monthly Roadmap */}
      <Accordion title="Monthly Roadmap">
        {results.monthly.map((item, i) => {
          const isCurrent = i + 1 === currentMonth;
          return (
            <div
              key={i}
              style={{
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "6px",
                background: isCurrent ? "#3d3ad47f" : "transparent"
              }}
            >
              <h3 style={{ fontSize: "18px", margin: "4px 0" }}>
                {item.month} {isCurrent && "(Current)"}
              </h3>
              <p style={{ margin: 0 }}>{item.content}</p>
            </div>
          );
        })}
      </Accordion>
    </div>
  );
};

export default Results;



// suggested MongoDB structure:
// startDate, dailyByMonth, weekly, and monthly 
// in results collection / tablename and fetch it instead of using mockData
// IN THEORY the only part of this code that needs upating is the mockdata, for every set of mockdata the code should be robust enough 
// to adapt to that mock data, and if the db data is the same format as the mock data here the transition should be seamless (fingers crossed)

// there are two lines of code that would need to be removed completely in the final code - the simulate date lines on lines 98 and 99 
// these lines are to show what the user would see (2) months from now (or whatever the simulated future date is) - removing them will not change code functionality
// but WOULD show the page in real time (i.e. the day of viewing)

// a SUGGESTION: the user can pick the date they want to start their plan, this date gets set as the variable startDate and recalled here from the DB