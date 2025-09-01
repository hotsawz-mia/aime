// What this test suite covers:
// ✅ Nested week structures - week_1, week_2 format
// ✅ Case insensitive handling - Week_1, WEEK_1, etc.
// ✅ Different separators - week-1, week1, week_1
// ✅ Multi-digit week numbers - week_10, week_100
// ✅ Flat week structures - Direct properties
// ✅ Different week array keys - weeks, weekly_plan, etc.
// ✅ toArray functionality - Single values → arrays
// ✅ Edge cases - Empty/null/undefined inputs
// ✅ Mixed structures - Combination of nested and flat
// ✅ Missing properties - Graceful handling of incomplete data

import Normalizer from "../../lib/normalizer";

describe("Normalizer", () => {
  describe("Nested week structure handling", () => {
    test("extracts data from week_1, week_2 format", () => {
      const input = {
        learning_plan: {
          weekly_plan: [
            {
              week_1: {
                objectives: ["Learn basics", "Practice daily"],
                activities: ["Vocal exercises", "Listen to music"],
                tips: ["Warm up first", "Record yourself"]
              }
            },
            {
              week_2: {
                objectives: ["Improve range"],
                activities: ["Scale practice"],
                tips: ["Stay hydrated"]
              }
            }
          ]
        }
      };

      const result = Normalizer(input);

      expect(result.weeks).toHaveLength(2);
      expect(result.weeks[0]).toEqual({
        weekNumber: 1,
        objectives: ["Learn basics", "Practice daily"],
        activities: ["Vocal exercises", "Listen to music"],
        tips: ["Warm up first", "Record yourself"]
      });
      expect(result.weeks[1]).toEqual({
        weekNumber: 2,
        objectives: ["Improve range"],
        activities: ["Scale practice"],
        tips: ["Stay hydrated"]
      });
    });

    test("handles case insensitive week keys", () => {
      const input = {
        learning_plan: {
          weekly_plan: [
            {
              Week_1: {
                objectives: ["Test objective"],
                activities: ["Test activity"],
                tips: ["Test tip"]
              }
            },
            {
              WEEK_2: {
                objectives: ["Another objective"],
                activities: ["Another activity"],
                tips: ["Another tip"]
              }
            }
          ]
        }
      };

      const result = Normalizer(input);

      expect(result.weeks[0].weekNumber).toBe(1);
      expect(result.weeks[1].weekNumber).toBe(2);
    });

    test("handles different separators in week keys", () => {
      const input = {
        learning_plan: {
          weekly_plan: [
            {
              "week-1": {
                objectives: ["Dash separator"],
                activities: ["Test"],
                tips: ["Test"]
              }
            },
            {
              "week1": {
                objectives: ["No separator"],
                activities: ["Test"],
                tips: ["Test"]
              }
            }
          ]
        }
      };

      const result = Normalizer(input);

      expect(result.weeks[0].weekNumber).toBe(1);
      expect(result.weeks[1].weekNumber).toBe(1);
    });

    test("handles multi-digit week numbers", () => {
      const input = {
        learning_plan: {
          weekly_plan: [
            {
              week_10: {
                objectives: ["Week 10 objective"],
                activities: ["Week 10 activity"],
                tips: ["Week 10 tip"]
              }
            },
            {
              week_100: {
                objectives: ["Week 100 objective"],
                activities: ["Week 100 activity"],
                tips: ["Week 100 tip"]
              }
            }
          ]
        }
      };

      const result = Normalizer(input);

      expect(result.weeks[0].weekNumber).toBe(10);
      expect(result.weeks[1].weekNumber).toBe(100);
    });
  });

  describe("Flat week structure handling", () => {
    test("processes flat week structure", () => {
      const input = {
        learning_plan: {
          weeks: [
            {
              weekNumber: 1,
              objectives: ["Direct objective"],
              activities: ["Direct activity"],
              tips: ["Direct tip"]
            },
            {
              week_number: 2,
              objectives: ["Snake case week number"],
              activities: ["Test activity"],
              tips: ["Test tip"]
            }
          ]
        }
      };

      const result = Normalizer(input);

      expect(result.weeks[0]).toEqual({
        weekNumber: 1,
        objectives: ["Direct objective"],
        activities: ["Direct activity"],
        tips: ["Direct tip"]
      });
      expect(result.weeks[1]).toEqual({
        weekNumber: 2,
        objectives: ["Snake case week number"],
        activities: ["Test activity"],
        tips: ["Test tip"]
      });
    });

    test("handles missing week numbers", () => {
      const input = {
        learning_plan: {
          weeks: [
            {
              objectives: ["No week number"],
              activities: ["Test activity"],
              tips: ["Test tip"]
            }
          ]
        }
      };

      const result = Normalizer(input);

      expect(result.weeks[0].weekNumber).toBeNull();
    });
  });

  describe("Different week array key handling", () => {
    test("finds weeks in weekly_plan key", () => {
      const input = {
        learning_plan: {
          weekly_plan: [
            {
              objectives: ["From weekly_plan"],
              activities: ["Test"],
              tips: ["Test"]
            }
          ]
        }
      };

      const result = Normalizer(input);
      expect(result.weeks[0].objectives).toEqual(["From weekly_plan"]);
    });

    test("finds weeks in weeklyPlan key", () => {
      const input = {
        learning_plan: {
          weeklyPlan: [
            {
              objectives: ["From weeklyPlan"],
              activities: ["Test"],
              tips: ["Test"]
            }
          ]
        }
      };

      const result = Normalizer(input);
      expect(result.weeks[0].objectives).toEqual(["From weeklyPlan"]);
    });

    test("finds weeks in weekly_plans key", () => {
      const input = {
        learning_plan: {
          weekly_plans: [
            {
              objectives: ["From weekly_plans"],
              activities: ["Test"],
              tips: ["Test"]
            }
          ]
        }
      };

      const result = Normalizer(input);
      expect(result.weeks[0].objectives).toEqual(["From weekly_plans"]);
    });

    test("falls back to first array found in learning_plan", () => {
      const input = {
        learning_plan: {
          some_other_array: [
            {
              objectives: ["From fallback"],
              activities: ["Test"],
              tips: ["Test"]
            }
          ],
          another_field: "not an array"
        }
      };

      const result = Normalizer(input);
      expect(result.weeks[0].objectives).toEqual(["From fallback"]);
    });
  });

  describe("toArray functionality", () => {
    test("ensures single values become arrays", () => {
      const input = {
        learning_plan: {
          weeks: [
            {
              objectives: "Single objective",
              activities: "Single activity",
              tips: "Single tip"
            }
          ]
        }
      };

      const result = Normalizer(input);

      expect(result.weeks[0].objectives).toEqual(["Single objective"]);
      expect(result.weeks[0].activities).toEqual(["Single activity"]);
      expect(result.weeks[0].tips).toEqual(["Single tip"]);
    });

    test("preserves existing arrays", () => {
      const input = {
        learning_plan: {
          weeks: [
            {
              objectives: ["Already", "an", "array"],
              activities: ["Also", "an", "array"],
              tips: ["Tips", "array"]
            }
          ]
        }
      };

      const result = Normalizer(input);

      expect(result.weeks[0].objectives).toEqual(["Already", "an", "array"]);
      expect(result.weeks[0].activities).toEqual(["Also", "an", "array"]);
      expect(result.weeks[0].tips).toEqual(["Tips", "array"]);
    });

    test("handles null/undefined values", () => {
      const input = {
        learning_plan: {
          weeks: [
            {
              objectives: null,
              activities: undefined,
              tips: false
            }
          ]
        }
      };

      const result = Normalizer(input);

      expect(result.weeks[0].objectives).toEqual([]);
      expect(result.weeks[0].activities).toEqual([]);
      expect(result.weeks[0].tips).toEqual([]);
    });
  });

  describe("Edge cases", () => {
    test("handles empty learning_plan", () => {
      const input = { learning_plan: {} };

      const result = Normalizer(input);

      expect(result.weeks).toEqual([]);
    });

    test("handles missing learning_plan", () => {
      const input = {};

      const result = Normalizer(input);

      expect(result.weeks).toEqual([]);
    });

    test("handles null input", () => {
      const result = Normalizer(null);

      expect(result.weeks).toEqual([]);
    });

    test("handles undefined input", () => {
      const result = Normalizer(undefined);

      expect(result.weeks).toEqual([]);
    });

    test("handles empty weeks array", () => {
      const input = {
        learning_plan: {
          weeks: []
        }
      };

      const result = Normalizer(input);

      expect(result.weeks).toEqual([]);
    });

    test("preserves other learning_plan properties", () => {
      const input = {
        learning_plan: {
          aim: "Test aim",
          success_criteria: "Test criteria",
          weeks: [
            {
              objectives: ["Test"],
              activities: ["Test"],
              tips: ["Test"]
            }
          ]
        }
      };

      const result = Normalizer(input);

      expect(result.aim).toBe("Test aim");
      expect(result.success_criteria).toBe("Test criteria");
      expect(result.weeks).toHaveLength(1);
    });
  });

  describe("Mixed structure handling", () => {
    test("handles mix of nested and flat weeks", () => {
      const input = {
        learning_plan: {
          weekly_plan: [
            {
              week_1: {
                objectives: ["Nested week"],
                activities: ["Test"],
                tips: ["Test"]
              }
            },
            {
              objectives: ["Flat week"],
              activities: ["Test"],
              tips: ["Test"],
              weekNumber: 2
            }
          ]
        }
      };

      const result = Normalizer(input);

      expect(result.weeks[0].weekNumber).toBe(1);
      expect(result.weeks[0].objectives).toEqual(["Nested week"]);
      expect(result.weeks[1].weekNumber).toBe(2);
      expect(result.weeks[1].objectives).toEqual(["Flat week"]);
    });

    test("handles weeks with missing properties", () => {
      const input = {
        learning_plan: {
          weeks: [
            {
              objectives: ["Has objectives only"]
            },
            {
              activities: ["Has activities only"]
            },
            {
              tips: ["Has tips only"]
            }
          ]
        }
      };

      const result = Normalizer(input);

      expect(result.weeks[0]).toEqual({
        weekNumber: null,
        objectives: ["Has objectives only"],
        activities: [],
        tips: []
      });
      expect(result.weeks[1]).toEqual({
        weekNumber: null,
        objectives: [],
        activities: ["Has activities only"],
        tips: []
      });
      expect(result.weeks[2]).toEqual({
        weekNumber: null,
        objectives: [],
        activities: [],
        tips: ["Has tips only"]
      });
    });
  });
});