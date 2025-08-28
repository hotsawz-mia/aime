export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": ["babel-jest", { presets: ["next/babel"] }],
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};