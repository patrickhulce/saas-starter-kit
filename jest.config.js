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
  moduleNameMapper: {
    '\.scss$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/steps/',
    '/e2e/test/',
    '/dist/',
  ],
  testRegex: '\\.test.(ts|js)x?$'
}
