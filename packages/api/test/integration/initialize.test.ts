import {IState} from '../typedefs'

module.exports = (state: IState) => {
  describe('initialize', () => {
    it('should start the server', done => {
      state.server = state.app.listen(() => {
        state.port = state.server.address().port
        state.baseURL = `http://localhost:${state.port}/api`
        done()
      })
    })
  })
}
