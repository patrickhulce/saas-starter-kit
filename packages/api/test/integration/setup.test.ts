import * as fetch from 'isomorphic-fetch'
import {IState} from '../typedefs'

module.exports = (state: IState) => {
  describe('initialize', () => {
    it('should sync the database', async () => {
      await state.sqlExtension.sync({force: true})
    })

    it('should start the server', done => {
      state.server = state.app.listen(() => {
        state.port = state.server.address().port
        state.baseURL = `http://localhost:${state.port}`
        done()
      })
    })

    it('should create an account', async () => {
      const payload = {
        name: 'Fake Unicorn',
        userDisplayName: 'Admin User',
        email: 'admin@example.com',
        password: 'password1',
      }

      global.__firebaseCreateUserMock = jest.fn().mockReturnValue({uid: '1234'})

      const response = await fetch(`${state.baseURL}/v1/accounts/register`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'content-type': 'application/json'},
      })

      expect(response.status).toBe(200)
      const {account, user} = await response.json()
      state.account = account
      state.user = user

      expect(account).toHaveProperty('id')
      expect(user).toHaveProperty('id')
      expect(user.firebaseId).toEqual('1234')
      expect(global.__firebaseCreateUserMock).toHaveBeenCalled()
    })

    it('should login', async () => {
      const payload = {
        grant_type: 'password',
        username: 'admin@example.com',
        password: 'password1',
      }

      global.__firebaseSignInMock = jest.fn().mockReturnValue({uid: state.user.firebaseId})

      const response = await fetch(`${state.baseURL}/v1/oauth/token`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'content-type': 'application/json'},
      })

      expect(response.status).toBe(200)
      state.token = (await response.json()).access_token
    })
  })
}
