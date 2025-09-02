export default function Normalizer(parsedPlan) {

    // function to parse content as JSON
//     function stripAndParseJSON(str) {
//       const trimmed = str.trim();
//       const withoutFences = trimmed.replace(/^```(?:json)?\s*|\s*```$/g, "");
//       return JSON5.parse(withoutFences);
//     }

// // intialize plan
//     let plan;
//     try {
//       plan = stripAndParseJSON(content);
//     } catch (e) {
//       console.error("Failed to parse OpenAI response:", e, { content });
//       throw new Error("OpenAI did not return valid JSON");  // Let getPlan handle the response
//     }

    // --- Normalize to a consistent shape we control ---
    const lp = parsedPlan?.learning_plan ?? {};

// Function that ensures any value is returned as an array: 
// - returns the value if already an array,
// - wraps non-array truthy values in an array,
// - returns an empty array for falsy values.
    const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);


// Selects the first property that contains an array of weeks, handling different possible key names from OpenAI output.
// note this is short hand for multiple if elseif block. it is a chained ternary
// when testing add any additional ai permutation on weeks
    let rawWeeks =
      Array.isArray(lp.weeks)
        ? lp.weeks
        : Array.isArray(lp.weekly_plan)
        ? lp.weekly_plan
        : Array.isArray(lp.weeklyPlan)
        ? lp.weeklyPlan
        : Array.isArray(lp.weekly_plans)
        ? lp.weekly_plans
        : Object.values(lp).find(v => Array.isArray(v)) // <-- penultimate fallback picks first key in the data
        || [];

// If no arrays found, look for direct week properties
if (!rawWeeks || rawWeeks.length === 0) {
const directWeekKeys = Object.keys(lp)
  .filter(key => /^(week[_-]?\d+|\d+)$/i.test(key))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || 0);
    const numB = parseInt(b.match(/\d+/)?.[0] || 0);
    return numA - numB;
  });
  
  if (directWeekKeys.length > 0) {
    // Convert direct properties to array format
    rawWeeks = directWeekKeys.map(key => ({
      [key]: lp[key]
    }));
  }
}

// Fallback to empty array
rawWeeks = rawWeeks || [];

// Normalizes each week object to a consistent shape, handling multiple possible key names.
// The nullish coalescing operator (??) returns the first value that is not null or undefined.
// Picks w.week_number if it exists, otherwise w.weekNumber, otherwise w.week, otherwise
const weeks = rawWeeks.map((w) => {
  // Handle nested week objects (week_1, week_2, etc.)
  let weekData = w;
  let weekNumber = w.week_number ?? w.weekNumber ?? w.week ?? null;
  
  // Check for nested week_X structure (case insensitive)
  const weekKeys = Object.keys(w).filter(key => 
  /^(week[_-]?\d+|\d+)$/i.test(key)  // Matches: week_1, Week_1, week-1, WEEK1, etc as well as 1, 2, 3 etc.
  );
  

  if (weekKeys.length > 0) {
    // Extract the nested week data
    weekData = w[weekKeys[0]];
    
    // Extract week number from the key
    const extractedNumber = weekKeys[0].match(/\d+/)?.[0];
    weekNumber = extractedNumber ? parseInt(extractedNumber, 10) : weekNumber;
  }

//   returns transformed week objects
  return {
    weekNumber: weekNumber,
    objectives: toArray(weekData.objectives),
    activities: toArray(weekData.activities),
    tips: toArray(weekData.tips),
  };
});

// The default here should probably be the original inputs and not
// come from the the learning plan at all as that is consistent data.
    // const normalized = {
    //   aim: lp.aim ?? lp.target ?? lp.target_skill ?? "",
    //   success_criteria: lp.success_criteria ?? lp.successLooksLike ?? "",
    //   starting_level: lp.starting_level ?? lp.startingLevel ?? "",
    //   target_date: lp.target_date ?? lp.targetDate ?? "",
    //   time_per_day: Number.isFinite(timePer) ? timePer : minutes,
    //   weeks,
    // };

    lp.weeks = weeks;

    return lp;
}