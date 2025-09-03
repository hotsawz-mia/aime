import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";



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
  const { learningPlan } = data.plan;
  if (!learningPlan) return <p>No learning plan found.</p>;


  return (
    <div data-theme="synthwave" className="min-h-screen bg-base-200">
      <main className="mx-auto w-full max-w-3xl p-6 md:p-10 space-y-6">
        {/* Header card */}
        <div className="card bg-base-100/80 backdrop-blur shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl text-secondary">
              {learningPlan.aim}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <p className="text-lg">
                <strong className="text-accent">Success Looks Like:</strong>{" "}
                {learningPlan.success}
              </p>
              <p className="text-lg">
                <strong className="text-info">Starting Level:</strong>{" "}
                {learningPlan.startingLevel}
              </p>
              <p className="text-lg">
                <strong className="text-warning">Target Date:</strong>{" "}
                {learningPlan.targetDate}
              </p>
              <p className="text-lg">
                <strong className="text-primary">Time / Day:</strong>{" "}
                {learningPlan.timePerDay} mins
              </p>
            </div>
          </div>
        </div>

        {/* Weeks accordion — highlight whichever is open */}
        <section className="space-y-3">
          {learningPlan.weeks.map((week) => (
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

              <div className="collapse-content space-y-4 w-full max-w-full">
                {/* Objectives */}
                {Array.isArray(week.objectives) && week.objectives.length > 0 && (
                  <div className="w-full">
                    <p className="text-lg font-semibold text-accent">Objectives</p>
                    <ul className="list-disc list-outside ps-5 md:ps-6 marker:text-base space-y-1 overflow-visible">
                      {week.objectives.map((obj, idx) => (
                        <li 
                          key={idx}
                          className="whitespace-normal break-words [overflow-wrap:anywhere] hyphens-auto"
                        >
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Activities as checkbox list
                {Array.isArray(week.activities) && week.activities.length > 0 && (
                  <div>
                    <p className="text-lg font-semibold text-success">Activities</p>
                    <div className="form-control gap-2 flex flex-col">
                      {week.activities.map((act, idx) => (
                        <label
                          key={idx}
                          className="label cursor-pointer justify-start gap-3 p-0 flex items-centre justify-between py1"
                        >
                          <span className="label-text flex-grow ml-4">{act}</span>
                          <input type="checkbox" className="checkbox checkbox-success checkbox-lg" />
                        </label>
                      ))}
                    </div>
                  </div>
                )} */}
                {/* Activities as checkbox list */}
                {Array.isArray(week.activities) && week.activities.length > 0 && (
                  <div className="w-full">
                    <p className="text-lg font-semibold text-success">Activities</p>
                    <div className="form-control gap-2">
                      {week.activities.map((act, idx) => (
                        <label
                          key={idx}
                          className="label cursor-pointer justify-start items-start gap-3 p-0 w-full flex-wrap min-w-0"
                        >
                          <input type="checkbox" className="checkbox checkbox-success mt-1" />
                          <span className="label-text flex-1 min-w-0 whitespace-normal break-words [overflow-wrap:anywhere] hyphens-auto">
                            {act}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {Array.isArray(week.tips) && week.tips.length > 0 && (
                  <div className="w-full">
                    <p className="text-lg font-semibold text-primary">Tips</p>
                    <ul className="list-disc list-outside ps-5 md:ps-6 marker:text-primary space-y-1 overflow-visible">
                      {week.tips.map((tip, idx) => (
                        <li 
                          key={idx}
                          className="whitespace-normal break-words [overflow-wrap:anywhere] hyphens-auto"
                        >
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Plan;

// one comment for the puposes of github
