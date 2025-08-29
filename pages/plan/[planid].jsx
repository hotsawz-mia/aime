import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Normalize the plan object to handle snake_case or camelCase
const normalizePlan = (plan) => {
  if (!plan) return null;

  const learningPlan = plan.learningPlan || plan.learning_plan || {};

  const rawWeeks = learningPlan.weeks || learningPlan.weeklyPlan || [];

  const weeks = rawWeeks.map((w) => ({
    weekNumber: w.weekNumber ?? w.week_number,
    objectives: w.objectives ?? [],
    activities: w.activities ?? [],
    tips: w.tips ?? [],
  }));

  return {
    aim: learningPlan.aim ?? "",
    successLooksLike: learningPlan.successLooksLike ?? learningPlan.success_criteria ?? "",
    startingLevel: learningPlan.startingLevel ?? learningPlan.starting_level ?? "",
    targetDate: learningPlan.targetDate ?? learningPlan.target_date ?? "",
    timeAvailablePerDay: learningPlan.timeAvailablePerDay ?? learningPlan.time_available_per_day ?? 0,
    weeks,
  };
};


const Plan = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { planid } = router.query;

  useEffect(() => {
    if (!planid) return; // wait for router hydration

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/getresult?id=${planid}`);
        if (!res.ok) throw new Error(`Plan not found (status ${res.status})`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching plan:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, [planid]);

  if (!planid) return <p>Loading route...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!data) return <p>Loading plan...</p>;

  const plan = normalizePlan(data.plan);
  if (!plan) return <p>No learning plan found.</p>;

  return (
    <div className="min-h-screen bg-base-200">
      <main className="mx-auto w-full max-w-2xl p-6 md:p-10">

        <h2 className="text-2xl">{plan.aim}</h2>
        <p className="text-xl p-6"><strong>Success Looks Like:</strong> {plan.successLooksLike}</p>
        <p className="text-xl p-6"><strong>Starting Level:</strong> {plan.startingLevel}</p>
        <p className="text-xl p-6"><strong>Target Date:</strong> {plan.targetDate}</p>
        <p className="text-xl p-6"><strong>Time Available Per Day:</strong> {plan.timeAvailablePerDay} mins</p>

        {plan.weeks.map((week) => (
          <div key={week.weekNumber} style={{ marginTop: "1rem" }}>
            <h3 className="text-xl">Week {week.weekNumber}</h3>

            {week.objectives.length > 0 && (
              <>
                <p className="text-large"><strong>Objectives:</strong></p>
                <ul>{week.objectives.map((obj, idx) => <li key={idx}>{obj}</li>)}</ul>
              </>
            )}

            {week.activities.length > 0 && (
              <>
                <p className="text-large"><strong>Activities:</strong></p>
                <ul>{week.activities.map((act, idx) => <li key={idx}>{act}</li>)}</ul>
              </>
            )}

            {week.tips.length > 0 && (
              <>
                <p className="text-large"><strong>Tips:</strong></p>
                <ul>{week.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}</ul>
              </>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default Plan;
