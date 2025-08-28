import { useState } from "react";
import { useRouter } from "next/router";

export default function AimePlannerForm() {
  const router = useRouter();

  const [aime, setAime] = useState("");
  const [success, setSuccess] = useState("");
  const [startLevel, setStartLevel] = useState("");
  const [targetDate, setTargetDate] = useState(""); // yyyy-mm-dd
  const [timePerDay, setTimePerDay] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();

    // validate ALL fields before early return
    const newErrors = {};
    if (!aime.trim()) newErrors.aime = "This field is required.";
    if (!success.trim()) newErrors.success = "This field is required.";
    if (!startLevel.trim()) newErrors.startLevel = "This field is required.";
    if (!targetDate.trim()) {
      newErrors.targetDate = "This field is required.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // strip time
      const picked = new Date(targetDate);
      if (isNaN(picked.getTime()) || picked <= today) {
        newErrors.targetDate = "Please pick a date in the future.";
      }
    }

    const timePerDayNum = Number(timePerDay);
    if (!timePerDay || isNaN(timePerDayNum) || timePerDayNum < 1 || timePerDayNum > 60) {
      newErrors.timePerDay = "Please enter a number between 1 and 60.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ aime, success, startLevel, targetDate, timePerDay }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { id } = await res.json();
      await router.push(`/plan/${id}`);
    } catch (err) {
      console.error(err);
      alert("Could not save.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <main className="mx-auto w-full max-w-2xl p-6 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* What’s your Aime? */}
          <div className="form-control">
            <label htmlFor="aime" className="label">
              <span className="label-text text-2xl">What’s your Aime?</span>
            </label>
            <input
              id="aime"
              type="text"
              className="input input-bordered w-full text-2xl"
              placeholder="Sing in a Rock Band"
              value={aime}
              onChange={(e) => {
                setAime(e.target.value);
                if (errors.aime) setErrors((p) => ({ ...p, aime: undefined }));
              }}
              autoComplete="off"
            />
            {errors.aime && <p className="text-error text-sm mt-1">{errors.aime}</p>}
          </div>

          {/* What does success look like for you? */}
          <div className="form-control">
            <label htmlFor="success" className="label">
              <span className="label-text text-2xl">What does success look like for you?</span>
            </label>
            <textarea
              id="success"
              className="textarea textarea-bordered w-full text-2xl leading-snug"
              placeholder="Perform in a small music venue with a band"
              rows={3}
              value={success}
              onChange={(e) => {
                setSuccess(e.target.value);
                if (errors.success) setErrors((p) => ({ ...p, success: undefined }));
              }}
            />
            {errors.success && <p className="text-error text-sm mt-1">{errors.success}</p>}
          </div>

          {/* Starting Level */}
          <div className="form-control">
            <label htmlFor="startLevel" className="label">
              <span className="label-text text-2xl">What level are you currently?</span>
            </label>
            <input
              id="startLevel"
              type="text"
              className="input input-bordered w-full text-2xl"
              placeholder="I sing in the shower"
              value={startLevel}
              onChange={(e) => {
                setStartLevel(e.target.value);
                if (errors.startLevel) setErrors((p) => ({ ...p, startLevel: undefined }));
              }}
              autoComplete="off"
            />
            {errors.startLevel && <p className="text-error text-sm mt-1">{errors.startLevel}</p>}
          </div>

          {/* Target Date */}
          <div className="form-control">
            <label htmlFor="targetDate" className="label">
              <span className="label-text text-2xl">When do you want to have achieved this goal by?</span>
            </label>
            <input
              id="targetDate"
              type="date"
              className="input input-bordered w-full text-2xl text-base-content appearance-none"
              value={targetDate}
              onChange={(e) => {
                setTargetDate(e.target.value);
                if (errors.targetDate) setErrors((p) => ({ ...p, targetDate: undefined }));
              }}
            />
            {errors.targetDate && <p className="text-error text-sm mt-1">{errors.targetDate}</p>}
          </div>

          {/* Time Per Day */}
          <div className="form-control">
            <label htmlFor="timePerDay" className="label">
              <span className="label-text text-2xl">How much time per day can you realistically commit?</span>
            </label>
            <p className="mt-1 text-sm opacity-70">
              If in doubt, think small. Most people think they can commit more time than they actually can.
            </p>
            <input
              id="timePerDay"
              type="number"
              min={1}
              max={60}
              step={1}
              className="input input-bordered w-full text-2xl"
              placeholder="minutes (1–60)"
              value={timePerDay}
              onChange={(e) => {
                setTimePerDay(e.target.value);
                if (errors.timePerDay) setErrors((p) => ({ ...p, timePerDay: undefined }));
              }}
              inputMode="numeric"
            />
            {errors.timePerDay && <p className="text-error text-sm mt-1">{errors.timePerDay}</p>}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="btn btn-primary btn-lg rounded-full px-8 shadow-md hover:shadow-lg transition hover:-translate-y-0.5"
              disabled={submitting}
            >
              {submitting ? "Saving…" : "Plan my goal"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}