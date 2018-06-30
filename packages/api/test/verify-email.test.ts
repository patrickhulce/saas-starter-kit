import {IState} from './typedefs'
import conf from '../../shared/lib/conf'

describe('change password', () => {
  const state: IState = {}

  beforeAll(() => {
    conf.sparkpost.sendToTestMailboxOnly = false
  })

  afterAll(() => {
    conf.sparkpost.sendToTestMailboxOnly = true
  })

  require('./steps/initialize.test')(state)
  require('./steps/account-setup.test')(state)

  describe('verify email', () => {
    it('should have sent a welcome email', () => {
      expect(__sparkpostSend).toHaveBeenCalled()
      const payload = __sparkpostSend.mock.calls[0][0]
      const address = payload.recipients[0].address
      payload.content.text = payload.content.text.replace(/key=[\w-]+/g, 'key=<key>')
      payload.content.html = payload.content.html.replace(/key=[\w-]+/g, 'key=<key>')
      address.email = address.email.replace(/.*@/, '<uuid>@')
      expect(payload).toMatchSnapshot()
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

  require('./steps/teardown.test')(state)
})
