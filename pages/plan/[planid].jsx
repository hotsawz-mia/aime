import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SignOutButton } from "@clerk/nextjs";


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

  // const plan = normalizePlan(data.plan);
  // if (!plan) return <p>No learning plan found.</p>;
  const { learning_plan } = data.plan;
  if (!learning_plan) return <p>No learning plan found.</p>;


  return (
    <div data-theme="synthwave" className="min-h-screen bg-base-200">
      <main className="mx-auto w-full max-w-3xl p-6 md:p-10 space-y-6">
        {/* Header card */}
        <div className="card bg-base-100/80 backdrop-blur shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl text-secondary">
              {learning_plan.aim}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <p className="text-lg">
                <strong className="text-accent">Success Looks Like:</strong>{" "}
                {learning_plan.success}
              </p>
              <p className="text-lg">
                <strong className="text-info">Starting Level:</strong>{" "}
                {learning_plan.startingLevel}
              </p>
              <p className="text-lg">
                <strong className="text-warning">Target Date:</strong>{" "}
                {learning_plan.targetDate}
              </p>
              <p className="text-lg">
                <strong className="text-primary">Time / Day:</strong>{" "}
                {learning_plan.timePerDay} mins
              </p>
            </div>
          </div>
        </div>

        {/* Weeks accordion — highlight whichever is open */}
        <section className="space-y-3">
          {learning_plan.weeks.map((week) => (
            <details
              key={week.weekNumber}
                className="collapse collapse-arrow bg-base-100/70 backdrop-blur shadow transition-all duration-200
+                          open:bg-neutral/10 open:ring-2 open:ring-neutral"
              open={week.weekNumber === 1} // Week 1 shown by default
            >
              <summary
                className="collapse-title text-xl font-bold select-none
+                          text-secondary open:text-neutral"
              >
                <span className="opacity-85">Week</span>{" "}
                <span className="font-extrabold">{week.weekNumber}</span>
              </summary>

              <div className="collapse-content space-y-4">
                {/* Objectives */}
                {Array.isArray(week.objectives) && week.objectives.length > 0 && (
                  <div>
                    <p className="text-lg font-semibold text-accent">Objectives</p>
                    <ul className="list-disc list-inside marker:text-base">
                      {week.objectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Activities as checkbox list */}
                {Array.isArray(week.activities) && week.activities.length > 0 && (
                  <div>
                    <p className="text-lg font-semibold text-success">Activities</p>
                    <div className="form-control gap-2">
                      {week.activities.map((act, idx) => (
                        <label
                          key={idx}
                          className="label cursor-pointer justify-start gap-3 p-0"
                        >
                          <input type="checkbox" className="checkbox checkbox-success" />
                          <span className="label-text">{act.activity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {Array.isArray(week.tips) && week.tips.length > 0 && (
                  <div>
                    <p className="text-lg font-semibold text-primary">Tips</p>
                    <ul className="list-disc list-inside marker:text-primary">
                      {week.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          ))}
        </section>

        <div className="flex justify-end">
          <SignOutButton>
            <button className="btn btn-error">Sign Out</button>
          </SignOutButton>
        </div>
      </main>
    </div>
  );
};

export default Plan;

// one comment for the puposes of github
