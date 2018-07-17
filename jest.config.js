module.exports = {
  testURL: 'http://localhost/',
  collectCoverageFrom: ['**/*.ts', '**/*.tsx', '!**/*.d.ts', '!**/lib/index.ts'],
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx', 'json'],
  moduleNameMapper: {
    '.scss$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '/test/steps/', '/e2e/test/', '/dist/'],
  testRegex: '\\.test.(ts|js)x?$',
}
