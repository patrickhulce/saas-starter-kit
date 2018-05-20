import conf from '../lib/conf'

describe('lib/conf.ts', () => {
  it('should define isUnderTest', () => {
    expect(conf.isUnderTest).toEqual(true)
  })
})
