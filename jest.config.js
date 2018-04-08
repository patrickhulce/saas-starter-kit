module.exports = {
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.d.ts',
    '!**/lib/index.ts',
  ],
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  testRegex: '\\.test.(ts|js)x?$'
}
