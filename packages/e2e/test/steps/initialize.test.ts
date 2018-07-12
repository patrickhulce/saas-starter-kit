import * as puppeteer from 'puppeteer'
import * as fetch from 'isomorphic-fetch'
import {configureToMatchImageSnapshot} from 'jest-image-snapshot'
import {IState} from '../../lib/typedefs'
import {Mailslurp} from '../../lib/mailslurp'
import {TestMailbox} from '../../lib/test-mailbox'
import conf from '../../../shared/lib/conf'

if (process.env.TEST_REAL_MAIL) {
  jest.setTimeout(15000)
}

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  failureThreshold: 0.1, // very loose match, just for catching catastrophic failures
  failureThresholdType: 'percent',
} as any)

expect.extend({toMatchImageSnapshot})

module.exports = (state: IState) => {
  describe('initialize', () => {
    it('should initialize state', () => {
      const rootURL = `http://localhost:${process.env.PORT || 3000}`
      Object.assign(state, {
        rootURL,
        mail: process.env.TEST_REAL_MAIL
          ? new Mailslurp(conf.mailslurp.apiKey)
          : new TestMailbox(rootURL),
        waitFor: 500,
      })
    })

    it('should start chrome', async () => {
      const headless = !process.env.DEBUG
      state.browser = await puppeteer.launch({headless})
      state.page = await state.browser.newPage()
    })

    it('should create a test account', async () => {
      state.userMailbox = await state.mail.createInbox()

      const login = {
        email: state.userMailbox.address,
        password: 'test_password',
      }

      const payload = {
        account: {name: 'Test Account'},
        user: {
          firstName: 'Test',
          lastName: 'User',
          ...login,
        },
      }

      const response = await fetch(`${state.rootURL}/api/v1/accounts/register`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'content-type': 'application/json'},
      })

      const body = await response.json()
      expect(body).toHaveProperty('account')
      state.login = login
    })
  })
}
