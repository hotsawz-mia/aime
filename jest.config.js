const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  clearMocks: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^next/navigation$': 'next-router-mock',
  },
}

module.exports = createJestConfig(config)