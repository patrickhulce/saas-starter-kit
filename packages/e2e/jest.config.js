module.exports = {
  transform: {
    '\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/steps/',
  ],
  testRegex: '\\.test.ts$',
}
