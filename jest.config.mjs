// export default {
//   testEnvironment: "node",
//   transform: {}, // no Babel
//   moduleFileExtensions: ["js", "jsx", "mjs", "cjs", "json"],
// };

// export default {
//     testEnvironment: "node",
//     transform: {},
//   };

// jest.config.mjs
export default {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".jsx"], // Remove ".mjs"
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "mjs", "cjs", "json"],
};