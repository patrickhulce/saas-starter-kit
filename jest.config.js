module.exports = {
  collectCoverageFrom: [
    '**/*.ts',
    '**/*.tsx',
    '!**/*.d.ts',
    '!**/lib/index.ts',
  ],
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/integration/',
    '/e2e/test/',
  ],
  testRegex: '\\.test.(ts|js)x?$'
}
