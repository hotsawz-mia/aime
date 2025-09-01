export default {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  moduleFileExtensions: ['js', 'jsx', 'mjs', 'cjs', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
