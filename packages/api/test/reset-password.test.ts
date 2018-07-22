import conf from '../../shared/lib/conf'

import {IState} from './typedefs'

describe('reset password', () => {
  const state: IState = {}
  let passwordResetKey: string

  beforeAll(() => {
    conf.sparkpost.sendToTestMailboxOnly = false
  })

  afterAll(() => {
    conf.sparkpost.sendToTestMailboxOnly = true
  })

  require('./steps/initialize.test')(state)
  require('./steps/account-setup.test')(state)

  describe('reset password', () => {
    it('should reject unauthenticated password changes', async () => {
      const response = await fetch(`${state.apiURL}/v1/users/password-reset`, {
        method: 'PUT',
        body: JSON.stringify({key: 'fake!', password: 'new-password1'}),
        headers: {'content-type': 'application/json'},
      })

      expect(await response.json()).toMatchSnapshot()
      expect(response.status).toBe(400)
    })

    it('should request a password reset', async () => {
      const response = await fetch(`${state.apiURL}/v1/users/password-reset`, {
        method: 'POST',
        body: JSON.stringify({email: state.user.email}),
        headers: {'content-type': 'application/json'},
      })

      expect(response.status).toBe(204)
    })

    it('should send a password reset email', async () => {
      expect(__sparkpostSend).toHaveBeenCalled()
      const payload = __sparkpostSend.mock.calls[1][0]
      const address = payload.recipients[0].address
      passwordResetKey = payload.content.text.match(/key=([\w-]+)/)[1]
      payload.content.text = payload.content.text.replace(/key=[\w-]+/g, 'key=<key>')
      payload.content.html = payload.content.html.replace(/key=[\w-]+/g, 'key=<key>')
      address.email = address.email.replace(/.*@/, '<uuid>@')
      expect(payload).toMatchSnapshot()
    })

    it('should accept password changes', async () => {
      const response = await fetch(`${state.apiURL}/v1/users/password-reset`, {
        method: 'PUT',
        body: JSON.stringify({key: passwordResetKey, password: 'new-password1'}),
        headers: {
          'content-type': 'application/json',
        },
      })

      expect(response.status).toBe(204)
    })

    it('should not login with old password', async () => {
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

      expect(response.status).toBe(401)
    })

    it('should login with new password', async () => {
      const payload = {
        grant_type: 'password',
        username: state.login.email,
        password: 'new-password1',
      }

      const response = await fetch(`${state.apiURL}/v1/oauth/token`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'content-type': 'application/json'},
      })

      expect(response.status).toBe(200)
      state.login.password = 'new-password1'
    })
  })

  require('./steps/teardown.test')(state)
})
