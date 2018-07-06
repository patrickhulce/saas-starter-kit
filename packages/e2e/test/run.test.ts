import {IState} from '../lib/typedefs'
import {Page, Browser} from 'puppeteer'
import {Mailslurp} from '../lib/mailslurp'
import {TestMailbox} from '../lib/test-mailbox'
import conf from '../../shared/lib/conf'

if (process.env.TEST_REAL_MAIL) {
  jest.setTimeout(15000)
}

describe('End-to-End Application', () => {
  const rootURL = `http://localhost:${process.env.PORT || 3000}`

  const state: IState = {
    browser: undefined as Browser,
    page: undefined as Page,
    rootURL,
    mail: process.env.TEST_REAL_MAIL
      ? new Mailslurp(conf.mailslurp.apiKey)
      : new TestMailbox(rootURL),
    waitFor: 500,
  }

  require('./steps/00-setup-chrome.test')(state)
  require('./steps/10-create-account.test')(state)
  require('./steps/99-teardown.test')(state)
})
