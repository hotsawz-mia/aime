import calculateWeeks from "../../lib/calculateWeeks";

describe("calculateWeeks", () => {
  // Mock date to Sept 2, 2025 for consistent testing
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-09-02"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("calculates weeks for future dates", () => {
    expect(calculateWeeks("2026-02-12")).toBe(24);
    expect(calculateWeeks("2025-12-01")).toBe(13);
  });

  test("handles close dates", () => {
    const tenDaysFromNow = new Date();
    tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);
    const targetDate = tenDaysFromNow.toISOString().split('T')[0];
    
    expect(calculateWeeks(targetDate)).toBe(2);
  });

  test("returns 1 for past dates and today", () => {
    expect(calculateWeeks("2024-01-01")).toBe(1);
    expect(calculateWeeks("2025-09-02")).toBe(1);
  });

  test("handles invalid dates", () => {
    expect(calculateWeeks("invalid")).toBeGreaterThanOrEqual(1);
    expect(calculateWeeks("")).toBeGreaterThanOrEqual(1);
  });

  test("always rounds up partial weeks", () => {
    // 8 days should be 2 weeks, not 1.14
    const eightDaysFromNow = new Date();
    eightDaysFromNow.setDate(eightDaysFromNow.getDate() + 8);
    const targetDate = eightDaysFromNow.toISOString().split('T')[0];
    
    expect(calculateWeeks(targetDate)).toBe(2);
  });
});