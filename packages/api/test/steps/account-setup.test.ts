import * as uuid from 'uuid'

import {IState} from '../typedefs'

module.exports = (state: IState) => {
  describe('account setup', () => {
    it('should create an account', async () => {
      const login = {
        email: `${uuid.v4()}@example.com`,
        password: 'password1',
      }

      const payload = {
        account: {name: 'Fake Unicorn'},
        user: {
          firstName: 'Admin',
          lastName: 'User',
          ...login,
        },
      }

      const response = await fetch(`${state.apiURL}/v1/accounts/register`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'content-type': 'application/json'},
      })

      expect(response.status).toBe(200)
      const {account, user} = await response.json()
      state.account = account
      state.user = user
      state.login = login

      expect(account).toHaveProperty('id')
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('isVerified', false)
      expect(user).not.toHaveProperty('verificationKey')
    })

    it('should login', async () => {
      const payload = {
        grant_type: 'password',
        username: state.login.email,
        password: state.login.password,
      }

      const response = await fetch(`${state.apiURL}/v1/oauth/token`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'content-type': 'application/json'},
      })

      expect(response.status).toBe(200)
      state.token = (await response.json()).access_token
      // make sure cookies will be passed through hosting
      expect(response.headers.get('cache-control')).toContain('private')
      expect(response.headers.get('set-cookie')).toContain(state.token)
    })
  })
}
