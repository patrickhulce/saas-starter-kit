import * as puppeteer from 'puppeteer'
import {IState} from '../../lib/typedefs'

module.exports = (state: IState) => {
  describe('teardown', () => {
    it('should teardown chrome', async () => {
      await state.browser.close()
    })
  })
}
