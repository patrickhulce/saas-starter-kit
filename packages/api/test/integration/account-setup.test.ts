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

    it('should have sent a welcome email', () => {
      expect(__sparkpostSend).toHaveBeenCalled()
      const payload = __sparkpostSend.mock.calls[0][0]
      const address = payload.recipients[0].address
      payload.content.text = payload.content.text.replace(/key=[\w-]+/g, 'key=<key>')
      payload.content.html = payload.content.html.replace(/key=[\w-]+/g, 'key=<key>')
      address.email = address.email.replace(/.*@/, '<uuid>@')
      expect(payload).toMatchSnapshot()
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

    it('should fetch logged in user', async () => {
      const response = await fetch(`${state.apiURL}/v1/users/me`, {
        headers: {cookie: `token=${state.token}`},
      })

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual(state.user)
    })

    it('should verify email address', async () => {
      let dbUser = await state.userExecutor.findById(state.user.id)
      const fetchOpts = {headers: {cookie: `token=${state.token}`}}
      const query = `key=${dbUser.verificationKey}`
      const response = await fetch(`${state.apiURL}/v1/users/verifications?${query}`, fetchOpts)
      expect(response.url).toMatch(/verification=success/)

      dbUser = await state.userExecutor.findById(state.user.id)
      expect(dbUser.isVerified).toBe(true)
    })
  })
}
