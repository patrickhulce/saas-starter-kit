module.exports = {
  transform: {
    '\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/test/steps/'],
  testRegex: '\\.test.ts$',
}
