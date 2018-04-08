import conf from '../lib/conf'

describe('lib/conf.ts', () => {
  it('should define JsEnvironment', () => {
    expect(conf.jsEnvironment).toEqual('server')
  })
})
