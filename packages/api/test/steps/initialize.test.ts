import {IDatabaseExecutor} from 'klay'
import {IState} from '../typedefs'
import {app, sqlExtension} from '../../lib/app'
import {kiln, ModelID, IUser} from '../../../shared/lib'

module.exports = (state: IState) => {
  describe('initialize', () => {
    it('should create the extensions', () => {
      const userExecutor = kiln.build(ModelID.User, sqlExtension) as IDatabaseExecutor<IUser>
      Object.assign(state, {app, sqlExtension, userExecutor})
    })

    it('should start the server', done => {
      state.server = state.app.listen(() => {
        state.port = state.server.address().port
        state.baseURL = `http://localhost:${state.port}`
        state.apiURL = `${state.baseURL}/api`
        done()
      })
    })
  })
}
