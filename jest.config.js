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
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  setupFiles: [
    `${__dirname}/packages/frontend/test/setup-tests.ts`
  ],
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  moduleNameMapper: {
    '\.scss$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/integration/',
    '/e2e/test/',
  ],
  testRegex: '\\.test.(ts|js)x?$'
}
