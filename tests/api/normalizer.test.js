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
test("handles plain number keys (1, 2, 3, etc.)", () => {
  const input = {
    learning_plan: {
      weekly_plan: [
        {
          "1": {
            objectives: ["Week 1 with number key"],
            activities: ["Number key activity"],
            tips: ["Number key tip"]
          }
        },
        {
          "2": {
            objectives: ["Week 2 with number key"],
            activities: ["Another number activity"],
            tips: ["Another number tip"]
          }
        },
        {
          "10": {
            objectives: ["Week 10 with double digit"],
            activities: ["Double digit activity"],
            tips: ["Double digit tip"]
          }
        }
      ]
    }
  };

  const result = Normalizer(input);

  expect(result.weeks).toHaveLength(3);
  expect(result.weeks[0]).toEqual({
      weekNumber: 1,
    objectives: ["Week 1 with number key"],
    activities: ["Number key activity"],
    tips: ["Number key tip"]
  });
  expect(result.weeks[1]).toEqual({
    weekNumber: 2,
    objectives: ["Week 2 with number key"],
    activities: ["Another number activity"],
    tips: ["Another number tip"]
  });
  expect(result.weeks[2]).toEqual({
    weekNumber: 10,
    objectives: ["Week 10 with double digit"],
    activities: ["Double digit activity"],
    tips: ["Double digit tip"]
  });
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

  test("handles mix of number keys and word keys", () => {
  const input = {
    learning_plan: {
      weekly_plan: [
        {
          "1": {
            objectives: ["Plain number key"],
            activities: ["Test"],
            tips: ["Test"]
          }
        },
        {
          week_2: {
            objectives: ["Word-based key"],
            activities: ["Test"],
            tips: ["Test"]
          }
        },
        {
          "3": {
            objectives: ["Another number key"],
            activities: ["Test"],
            tips: ["Test"]
          }
        }
      ]
    }
  };

  const result = Normalizer(input);

  expect(result.weeks[0].weekNumber).toBe(1);
  expect(result.weeks[0].objectives).toEqual(["Plain number key"]);
  expect(result.weeks[1].weekNumber).toBe(2);
  expect(result.weeks[1].objectives).toEqual(["Word-based key"]);
  expect(result.weeks[2].weekNumber).toBe(3);
  expect(result.weeks[2].objectives).toEqual(["Another number key"]);
});

});

// Add this new describe block after the "Mixed structure handling" section
describe("Direct week properties handling", () => {
  test("handles direct week properties in learning_plan (no array wrapper)", () => {
    const input = {
      learning_plan: {
        week_1: {
          objectives: ["Understand basic vocal techniques", "Learn 1 rock song lyrics"],
          activities: ["Watch vocal technique tutorials online", "Practice singing scales for 10 minutes daily"],
          tips: ["Focus on breathing and posture while singing", "Record yourself singing to track progress"]
        },
        week_2: {
          objectives: ["Improve pitch accuracy", "Practice singing with a backing track"],
          activities: ["Use vocal tuning apps to practice pitch", "Sing along with rock songs"],
          tips: ["Start slow and gradually increase tempo", "Listen carefully to the original singers"]
        },
        week_3: {
          objectives: ["Develop vocal range", "Work on stage presence"],
          activities: ["Practice vocal exercises to expand range", "Watch live performance videos"],
          tips: ["Warm up thoroughly before attempting high or low notes", "Practice moving naturally on stage"]
        }
      }
    };

    const result = Normalizer(input);

    expect(result.weeks).toHaveLength(3);
    expect(result.weeks[0]).toEqual({
      weekNumber: 1,
      objectives: ["Understand basic vocal techniques", "Learn 1 rock song lyrics"],
      activities: ["Watch vocal technique tutorials online", "Practice singing scales for 10 minutes daily"],
      tips: ["Focus on breathing and posture while singing", "Record yourself singing to track progress"]
    });
    expect(result.weeks[1]).toEqual({
      weekNumber: 2,
      objectives: ["Improve pitch accuracy", "Practice singing with a backing track"],
      activities: ["Use vocal tuning apps to practice pitch", "Sing along with rock songs"],
      tips: ["Start slow and gradually increase tempo", "Listen carefully to the original singers"]
    });
    expect(result.weeks[2]).toEqual({
      weekNumber: 3,
      objectives: ["Develop vocal range", "Work on stage presence"],
      activities: ["Practice vocal exercises to expand range", "Watch live performance videos"],
      tips: ["Warm up thoroughly before attempting high or low notes", "Practice moving naturally on stage"]
    });
  });

  test("handles direct week properties with mixed key formats", () => {
    const input = {
      learning_plan: {
        week_1: {
          objectives: ["First week with underscore"],
          activities: ["Test activity"],
          tips: ["Test tip"]
        },
        "week-2": {
          objectives: ["Second week with dash"],
          activities: ["Test activity"],
          tips: ["Test tip"]
        },
        "3": {
          objectives: ["Third week with plain number"],
          activities: ["Test activity"],
          tips: ["Test tip"]
        },
        Week_4: {
          objectives: ["Fourth week with capital W"],
          activities: ["Test activity"],
          tips: ["Test tip"]
        }
      }
    };

    const result = Normalizer(input);

    expect(result.weeks).toHaveLength(4);
    expect(result.weeks[0].weekNumber).toBe(1);
    expect(result.weeks[0].objectives).toEqual(["First week with underscore"]);
    expect(result.weeks[1].weekNumber).toBe(2);
    expect(result.weeks[1].objectives).toEqual(["Second week with dash"]);
    expect(result.weeks[2].weekNumber).toBe(3);
    expect(result.weeks[2].objectives).toEqual(["Third week with plain number"]);
    expect(result.weeks[3].weekNumber).toBe(4);
    expect(result.weeks[3].objectives).toEqual(["Fourth week with capital W"]);
  });

  test("handles direct week properties with many weeks", () => {
    const input = {
      learning_plan: {
        week_1: { objectives: ["Week 1"], activities: ["Activity 1"], tips: ["Tip 1"] },
        week_2: { objectives: ["Week 2"], activities: ["Activity 2"], tips: ["Tip 2"] },
        week_3: { objectives: ["Week 3"], activities: ["Activity 3"], tips: ["Tip 3"] },
        week_4: { objectives: ["Week 4"], activities: ["Activity 4"], tips: ["Tip 4"] },
        week_5: { objectives: ["Week 5"], activities: ["Activity 5"], tips: ["Tip 5"] },
        week_10: { objectives: ["Week 10"], activities: ["Activity 10"], tips: ["Tip 10"] },
        week_13: { objectives: ["Week 13"], activities: ["Activity 13"], tips: ["Tip 13"] }
      }
    };

    const result = Normalizer(input);

    expect(result.weeks).toHaveLength(7);
    expect(result.weeks[0].weekNumber).toBe(1);
    expect(result.weeks[4].weekNumber).toBe(5);
    expect(result.weeks[5].weekNumber).toBe(10);
    expect(result.weeks[6].weekNumber).toBe(13);
    expect(result.weeks[6].objectives).toEqual(["Week 13"]);
  });

  test("prioritizes array format over direct properties", () => {
    const input = {
      learning_plan: {
        // Array format should take priority
        weekly_plan: [
          {
            week_1: {
              objectives: ["From array format"],
              activities: ["Array activity"],
              tips: ["Array tip"]
            }
          }
        ],
        // Direct properties should be ignored when array exists
        week_1: {
          objectives: ["From direct properties - should be ignored"],
          activities: ["Direct activity"],
          tips: ["Direct tip"]
        }
      }
    };

    const result = Normalizer(input);

    expect(result.weeks).toHaveLength(1);
    expect(result.weeks[0].objectives).toEqual(["From array format"]);
    expect(result.weeks[0].activities).toEqual(["Array activity"]);
  });
});