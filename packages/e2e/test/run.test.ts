import {IState} from '../lib/typedefs'

describe('Create Account Flow', () => {
  const state: IState = {}

  require('./steps/00-setup-chrome.test')(state)
  require('./steps/10-create-account.test')(state)
  require('./steps/99-teardown.test')(state)
})
