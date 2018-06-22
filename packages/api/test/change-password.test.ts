import {IState} from './typedefs'

describe('change password', () => {
  const state: IState = {}

  require('./steps/initialize.test')(state)
  require('./steps/account-setup.test')(state)

  describe('change password', () => {
    it('should reject unauthenticated password changes', async () => {
      const response = await fetch(`${state.apiURL}/v1/users/${state.user.id}/password`, {
        method: 'PUT',
        body: JSON.stringify({password: 'new-password1'}),
        headers: {'content-type': 'application/json'},
      })

      expect(response.status).toBe(401)
    })

    it('should reject password changes that do not confirm existing password', async () => {
      const response = await fetch(`${state.apiURL}/v1/users/${state.user.id}/password`, {
        method: 'PUT',
        body: JSON.stringify({password: 'new-password1'}),
        headers: {'content-type': 'application/json', cookie: `token=${state.token}`},
      })

      expect(response.status).toBe(400)
      expect(await response.json()).toMatchSnapshot()
    })

    it('should accept password changes', async () => {
      const response = await fetch(`${state.apiURL}/v1/users/${state.user.id}/password`, {
        method: 'PUT',
        body: JSON.stringify({password: 'new-password1'}),
        headers: {
          'content-type': 'application/json',
          cookie: `token=${state.token}`,
          'x-current-password': 'password1',
        },
      })

      expect(response.status).toBe(200)
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
