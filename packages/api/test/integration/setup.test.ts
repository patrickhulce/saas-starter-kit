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
        account: {name: 'Fake Unicorn'},
        user: {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          password: 'password1',
        },
      }

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
    })

    it('should have sent a welcome email', () => {
      const send = (global as any).__sparkpostSend
      expect(send).toHaveBeenCalled()
      expect(send.mock.calls[0][0]).toMatchSnapshot()
    })

    it('should login', async () => {
      const payload = {
        grant_type: 'password',
        username: 'admin@example.com',
        password: 'password1',
      }

      const response = await fetch(`${state.baseURL}/v1/oauth/token`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'content-type': 'application/json'},
      })

      expect(response.status).toBe(200)
      state.token = (await response.json()).access_token
      // make sure cookies will be passed through firebase hosting
      expect(response.headers.get('cache-control')).toContain('private')
      expect(response.headers.get('set-cookie')).toContain(state.token)
    })

    it('should fetch logged in user', async () => {
      const response = await fetch(`${state.baseURL}/v1/users/me`, {
        headers: {cookie: `token=${state.token}`},
      })

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual(state.user)
    })
  })
}
