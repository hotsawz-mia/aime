const calculateWeeks = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);
  
  const timeDifference = target.getTime() - today.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  const numberOfWeeks = Math.ceil(daysDifference / 7);
  
  return Math.max(numberOfWeeks, 1);
};

export default calculateWeeks;


// Test cases to experiment with
console.log("=== Testing calculateWeeks function ===");

// Test 1: Future date (your example)
console.log("Test 1 - Target: 2026-02-12");
console.log("Weeks:", calculateWeeks("2026-02-12"));

// Test 2: Near future
console.log("\nTest 2 - Target: 2025-12-01");
console.log("Weeks:", calculateWeeks("2025-12-01"));

// Test 3: Very close date
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 10);
console.log("\nTest 3 - Target: 10 days from now");
console.log("Weeks:", calculateWeeks(nextWeek.toISOString().split('T')[0]));

// Test 4: Past date (should return 1)
console.log("\nTest 4 - Target: 2024-01-01 (past date)");
console.log("Weeks:", calculateWeeks("2024-01-01"));

// Test 5: Today (should return 1)
const today = new Date().toISOString().split('T')[0];
console.log("\nTest 5 - Target: Today");
console.log("Weeks:", calculateWeeks(today));


// Test 6: Show the math
console.log("\n=== Showing the calculation breakdown ===");
const testDate = "2026-02-12";
const todayDate = new Date();
const targetDate = new Date(testDate);
const timeDiff = targetDate.getTime() - todayDate.getTime();
const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

console.log(`Today: ${todayDate.toDateString()}`);
console.log(`Target: ${targetDate.toDateString()}`);
console.log(`Time difference (ms): ${timeDiff}`);
console.log(`Days difference: ${daysDiff}`);
console.log(`Weeks (daysDiff / 7): ${Math.ceil(daysDiff / 7)}`);