import {IState} from '../lib/typedefs'
import {conf} from '../../shared/lib'
import {Page, Browser} from 'puppeteer'

jest.setTimeout(15000)

describe('End-to-End Application', () => {
  const state: IState = {
    browser: undefined as Browser,
    page: undefined as Page,
    rootURL: `http://localhost:${process.env.PORT}`,
    waitFor: 500,
  }

  require('./steps/00-setup-chrome.test')(state)
  require('./steps/10-create-account.test')(state)
  require('./steps/99-teardown.test')(state)
})
