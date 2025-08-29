// pages/results.jsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

/* ---------------- helpers: parsing + normalization ---------------- */

function parseMinutesFromTimeString(s) {
  if (!s || typeof s !== "string") return 30;
  const lower = s.toLowerCase().trim();
  const num = parseInt(lower.replace(/[^\d]/g, ""), 10);
  if (Number.isNaN(num)) return 30;
  if (lower.includes("hour")) return num * 60;
  return num;
}

function allocateDaily(minutes) {
  const parts = [1, 2, 2, 1];
  const total = parts.reduce((a, b) => a + b, 0);
  const raw = parts.map((p) => Math.round((p / total) * minutes));
  const drift = minutes - raw.reduce((a, b) => a + b, 0);
  raw[1] += drift;
  return raw;
}

function summarizeMonth(weeksSlice) {
  const objs = weeksSlice.flatMap((w) => w.objectives || []);
  const uniq = Array.from(new Set(objs));
  return uniq.length ? uniq.join("; ") : "Progress this month toward your goals.";
}

function dailyTemplateForMonth(monthIndex) {
  switch (monthIndex) {
    case 1: return [
      "Lip trills, sirens, humming, gentle scales. Focus on breath support and relaxation.",
      "Exercises for vocal range, breath control, resonance, and pitch accuracy.",
      "Learn and rehearse songs line by line, focus on pitch, phrasing, emotion.",
      "Gentle humming or descending scales to relax vocal cords."
    ];
    case 2: return [
      "Extend warmups slightly for range expansion.",
      "Introduce controlled grit/distortion and basic stamina work.",
      "Build a 4-5 song set with karaoke/instrumentals.",
      "Release tension from grit with gentle humming/scales."
    ];
    case 3: return [
      "Full-range sirens with breath control for stamina.",
      "Sustain notes; endurance with light grit where safe.",
      "Perform full songs start-to-finish; aim toward a 6-7 song set.",
      "Gentle humming and scales to release tension."
    ];
    case 4: return [
      "Quick, efficient pre-rehearsal warmup.",
      "Dynamics practice (soft/loud, clean/gritty).",
      "Rehearse 7-8 songs in set order; simulate transitions.",
      "Recovery cooldown after extended practice."
    ];
    case 5: return [
      "Fast, efficient gig-style warmup.",
      "Maintenance technique; conserve voice.",
      "Run the entire setlist; stamina + stage interaction.",
      "Strict cooldown and recovery."
    ];
    default:
      return [
        "Exact warmup you'll use before the show.",
        "Minimal technique; keep voice fresh.",
        "Simulate full live performance incl. crowd talk & movement.",
        "Always cool down after rehearsal/performance."
      ];
  }
}

function addDaysISO(isoDate, days) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/* ---------------- Accordion ---------------- */

const Accordion = ({ title, children, openDefault = false }) => {
  const [isOpen, setIsOpen] = useState(openDefault);
  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "20px",
          background: "#d6d3d3ff",
          padding: "8px",
          borderRadius: "6px"
        }}
      >
        {title} {isOpen ? "▲" : "▼"}
      </div>
      {isOpen && <div style={{ padding: "10px" }}>{children}</div>}
    </div>
  );
};

/* ---------------- main page ---------------- */

export default function ResultsPage() {
  const [results, setResults] = useState(null);
  // makes navigation possible
  const router = useRouter();

  // derived state
  const [currentMonth, setCurrentMonth] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  // Simulation controls
  const [simulateOn, setSimulateOn] = useState(false);
  const [simulateDateStr, setSimulateDateStr] = useState("");

  useEffect(() => {
    const fetchData = async () => {
    const { id } = router.query;
    if (!id) return;

    const res = await fetch(`/api/getresult?id=${id}`);
    const data = await res.json();
      // ---- Replace this "incoming" with the real backend response ----
      // const incoming = {
      //   plan: {
      //     learning_plan: {
      //       start_date: "2025-08-26",  // !!!!             // <-- backend-provided user start date // change as needed for testing
      //       target_date: "2025-11-03", // !!!! - target date will need to reflect how many weeks the plan length is, this should be handled by AI
      //       time_available_per_day: "1 hour",
      //       weeks: [
      //         {
      //           week_number: 1,
      //           objectives: ["Understand basic vocal techniques"],
      //           activities: ["Watch online tutorials on vocal warm-ups and exercises", "Practice scales and breathing exercises daily"],
      //           tips: ["Stay hydrated to maintain vocal health", "Record yourself singing to track progress"]
      //         },
      //         {
      //           week_number: 2,
      //           objectives: ["Learn how to control pitch and tone"],
      //           activities: ["Focus on hitting and sustaining notes accurately", "Practice singing along with favorite rock songs"],
      //           tips: ["Listen to the original recordings to mimic pitch and tone", "Experiment with different vocal styles"]
      //         },
      //         { 
      //           week_number: 3,
      //           objectives: ["Build confidence in singing in front of others"],
      //           activities: ["Sing in front of friends or family members","Participate in a virtual open mic night"],
      //           tips: ["Start with smaller audiences to ease into performing","Focus on expressing emotions through your singing"]
      //         },
      //         { week_number: 4,
      //           objectives: ["Improve stage presence and movement"],
      //           activities: ["Watch live performances of rock bands to study stage presence","Practice moving and interacting with an imaginary audience"],
      //           tips: ["Use gestures and body language to engage the audience","Practice performing in front of a mirror to observe your movements"]
      //         },
      //         { 
      //           week_number: 5,
      //           objectives: ["Work on memorizing lyrics and stage banter"],
      //           activities: ["Create lyric sheets and practice memorization techniques","Develop stage banter scripts and practice improvisation"],
      //           tips: ["Break down lyrics into smaller sections for easier memorization","Rehearse stage banter to sound natural and confident"]
      //         },
      //         { 
      //           week_number: 6,
      //           objectives: ["Prepare and rehearse a setlist of rock songs"],
      //           activities: ["Select songs that showcase your vocal range and style","Practice singing the setlist in sequence with pauses for transitions"],
      //           tips: ["Focus on creating a cohesive setlist with varied dynamics","Record yourself performing the setlist to evaluate performance"]
      //         },
      //         { 
      //           week_number: 7,
      //           objectives: ["Refine performance skills and stage presence"],
      //           activities: ["Rehearse the setlist with a focus on performance aspects","Seek feedback from peers or a vocal coach"],
      //           tips: ["Experiment with microphone techniques for different vocal effects","Visualize a successful performance to boost confidence"]
      //         },
      //         { 
      //           week_number: 8,
      //           objectives: ["Perform a mini-concert for friends or family"],
      //           activities: ["Organize a small performance at home or in a backyard setting","Showcase your setlist with stage presence and interaction"],
      //           tips: ["Create a cozy atmosphere with lighting and decorations","Ask for honest feedback to improve further"]
      //         },
      //         { 
      //           week_number: 9,
      //           objectives: ["Overcome stage fright and nerves"],
      //           activities: ["Practice mindfulness and relaxation techniques before performing","Visualize successful performances and positive outcomes"],
      //           tips: ["Focus on your breathing to calm nerves before going on stage","Remind yourself that mistakes are part of the learning process"]
      //         },
      //         { 
      //           week_number: 10,
      //           objectives: ["Prepare for a local venue performance"],
      //           activities: ["Research local venues and open mic nights to participate in","Plan your setlist and rehearse with a focus on live performance"],
      //           tips: ["Communicate with the venue to understand performance logistics","Attend local live music events to observe and learn from other performers"]
      //         }
      //       ]
      //     }
      //   }
      // };

      // ---- Normalize → your UI shape ----
      const lp = results?.plan?.learning_plan || {};
      const startDate = lp.start_date || new Date().toISOString().slice(0, 10); // USE BACKEND'S DATE
      const minutesPerDay = parseMinutesFromTimeString(lp.time_available_per_day);
      const weeks = Array.isArray(lp.weeks) ? lp.weeks : [];

      const monthsCount = Math.max(1, Math.ceil(weeks.length / 4));
      const [warm, tech, song, cool] = allocateDaily(minutesPerDay);

      const dailyByMonth = {};
      for (let m = 1; m <= monthsCount; m++) {
        const templ = dailyTemplateForMonth(m);
        dailyByMonth[String(m)] = [
          { step: "Warm-up", time: `${warm} min`, content: templ[0] },
          { step: "Technique", time: `${tech} min`, content: templ[1] },
          { step: "Song Practice", time: `${song} min`, content: templ[2] },
          { step: "Cooldown", time: `${cool} min`, content: templ[3] }
        ];
      }

      const monthly = [];
      for (let m = 1; m <= monthsCount; m++) {
        const startIdx = (m - 1) * 4;
        const monthWeeks = weeks.slice(startIdx, startIdx + 4);
        monthly.push({
          month: `Month ${m}`,
          content: summarizeMonth(monthWeeks)
        });
      }

      const weekly = [
        { day: "Day 1-5", content: "Follow the daily routine (adapts to current month)." },
        { day: "Day 6", content: "Performance rehearsal: run full songs/set as practice; record & review." },
        { day: "Day 7", content: "Rest / reflection: light humming, watch live performances, take notes." }
      ];

      // Plan length (prefer exact weeks; fallback to months*4)
      const totalWeeks = weeks.length || monthsCount * 4;
      const planEndDate = addDaysISO(startDate, Math.max(0, totalWeeks * 7 - 1)); // inclusive end

      const normalized = {
        userId: null,
        startDate,            // fixed per user from backend
        dailyByMonth,
        weekly,
        monthly,
        totalWeeks,
        planEndDate,          // ISO YYYY-MM-DD
        __rawWeeks: weeks
      };

      setResults(normalized);
    };

    fetchData();

    }, [router.query.id]);


  // Recompute current month/week/day (clamped within plan length)
  useEffect(() => {
    if (!results) return;

    const start = new Date(results.startDate);

    // Use simulated date if enabled and valid; else real now
    const simValid = simulateOn && simulateDateStr && !Number.isNaN(Date.parse(simulateDateStr));
    let now = simValid ? new Date(simulateDateStr) : new Date();

    // Clamp "now" to [startDate, planEndDate]
    const minDate = new Date(results.startDate);
    const maxDate = new Date(results.planEndDate || results.startDate);
    if (now < minDate) now = minDate;
    if (now > maxDate) now = maxDate;

    const totalMonths = Object.keys(results.dailyByMonth || {}).length || 1;
    const totalWeeks = results.totalWeeks || totalMonths * 4;

    // Raw day difference
    const rawDiffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    // Clamp days so we never exceed plan length
    const maxDayIndex = Math.max(0, totalWeeks * 7 - 1);
    const clampedDiffDays = Math.min(Math.max(0, rawDiffDays), maxDayIndex);

    const weekNum = Math.floor(clampedDiffDays / 7) + 1; // 1..totalWeeks
    const dayNum = clampedDiffDays % 7;                  // 0..6

    // Derive month from week (1-based), clamp to available months
    const monthFromWeek = Math.ceil(weekNum / 4);
    const current = Math.min(totalMonths, Math.max(1, monthFromWeek));

    setCurrentMonth(current);
    setCurrentWeek(weekNum);
    setCurrentDayIndex(dayNum);
  }, [results, simulateOn, simulateDateStr]);

  if (!results) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Your Aime Breakdown</h1>

      {/* Simulation Controls */} 
      <div style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        margin: "10px 0",
        padding: "10px",
        background: "#fafafa",
        border: "1px solid #eee",
        borderRadius: "6px"
      }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={simulateOn}
            onChange={(e) => setSimulateOn(e.target.checked)}
          />
          Simulate date
        </label>
        <input
          type="date"
          value={simulateDateStr}
          onChange={(e) => setSimulateDateStr(e.target.value)}
          disabled={!simulateOn}
          min={results.startDate}          // can't pick before plan start
          max={results.planEndDate}        // can't pick past plan end
          style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
        <span style={{ fontSize: "12px", color: "#666" }}>
          {simulateOn && simulateDateStr
            ? `Using simulated date: ${simulateDateStr}`
            : "Using today's date"}
        </span>
      </div>

      <p style={{ marginTop: 0 }}>
        Day {currentDayIndex + 1} of Week {currentWeek} (Month {currentMonth})
      </p>
      <p style={{ marginTop: 0, color: "#6b7280" }}>
        Plan window: {results.startDate} → {results.planEndDate}
      </p>

      {/* Daily Schedule (current month expanded; others collapsed) */}
      <Accordion title="Daily Schedule" openDefault={true}>
        {Object.entries(results.dailyByMonth).map(([month, steps]) => {
          const isCurrent = parseInt(month, 10) === currentMonth;

          if (isCurrent) {
            let dailyContent;
            if (currentDayIndex < 5) {
              dailyContent = steps.map((item, i) => (
                <div key={i} style={{ marginBottom: "10px" }}>
                  <h3 style={{ fontSize: "18px", margin: "4px 0" }}>
                    {item.step} ({item.time})
                  </h3>
                  <p style={{ margin: 0 }}>{item.content}</p>
                </div>
              ));
            } else if (currentDayIndex === 5) {
              dailyContent = <p style={{ fontSize: "16px" }}>{results.weekly[1].content}</p>;
            } else {
              dailyContent = <p style={{ fontSize: "16px" }}>{results.weekly[2].content}</p>;
            }

            return (
              <div
                key={month}
                style={{
                  marginBottom: "20px",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "#3476b17b"
                }}
              >
                <h2 style={{ fontSize: "22px", margin: "10px 0" }}>
                  Day {currentDayIndex + 1} of Week {currentWeek} (Month {month} - Current)
                </h2>
                {dailyContent}
              </div>
            );
          }

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

      {/* Weekly Schedule (progress styling) */}
      <Accordion title="Weekly Schedule">
        {(() => {
          const dayStyles = (status) => {
            if (status === "today") return { background: "#84b9f295", opacity: 1 };
            if (status === "past") return { background: "transparent", opacity: 0.45, color: "#6b7280" };
            return { background: "transparent", opacity: 1 };
          };
          const statusForIndex = (idx) => {
            if (idx < currentDayIndex) return "past";
            if (idx === currentDayIndex) return "today";
            return "upcoming";
          };

          return results.weekly.map((item, i) => {
            if (item.day.includes("1–5")) {
              return (
                <div key={i}>
                  {[...Array(5)].map((_, weekdayIdx) => {
                    const status = statusForIndex(weekdayIdx);
                    return (
                      <div
                        key={weekdayIdx}
                        style={{
                          marginBottom: "10px",
                          padding: "10px",
                          borderRadius: "6px",
                          ...dayStyles(status)
                        }}
                      >
                        <h3 style={{ fontSize: "18px", margin: "4px 0" }}>
                          Day {weekdayIdx + 1} {status === "today" ? "(Today)" : ""}
                        </h3>
                        <p style={{ margin: 0 }}>{item.content}</p>
                      </div>
                    );
                  })}
                </div>
              );
            }
            const idx = i === 1 ? 5 : 6; // Day 6 or Day 7
            const status = statusForIndex(idx);
            return (
              <div
                key={i}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "6px",
                  ...dayStyles(status)
                }}
              >
                <h3 style={{ fontSize: "18px", margin: "4px 0" }}>
                  {item.day} {status === "today" ? "(Today)" : ""}
                </h3>
                <p style={{ margin: 0 }}>{item.content}</p>
              </div>
            );
          });
        })()}
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
                background: isCurrent ? "#a85dac9f" : "transparent"
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
}

// target_date - this file might need to be updated for robustness if we get a fixed target date from the user rather than using weeks.length
// NOTE that the simulated future date will not persist if the page is reloaded - page defaults to current actual day
// suggested MongoDB structure:

// a SUGGESTION: the user can pick the date they want to start their plan, and end their plan, these dates get set as the variable start_date and target_date and recalled here from the DB or wherever