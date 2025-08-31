export default {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".jsx"], // Remove ".mjs"
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "mjs", "cjs", "json"],
};