export default function Normalizer(parsedPlan) {
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

// Handle case where weeks is an object (not array)
if ((!rawWeeks || rawWeeks.length === 0) && lp.weeks && typeof lp.weeks === 'object') {
  const weekKeys = Object.keys(lp.weeks).filter(key => 
    /^(week[_-]?\d+|\d+)$/i.test(key)
  ).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || 0);
    const numB = parseInt(b.match(/\d+/)?.[0] || 0);
    return numA - numB;
  });
  
  if (weekKeys.length > 0) {
    rawWeeks = weekKeys.map(key => ({
      [key]: lp.weeks[key]  // ← Note: lp.weeks[key], not lp[key]
    }));
  }
}

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
    activities: toArray(weekData.activities).map(activity => ({ activity: activity, completed: false })),
    tips: toArray(weekData.tips),
  };
});

    lp.weeks = weeks;

    return lp;
}