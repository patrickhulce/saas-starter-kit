import * as puppeteer from 'puppeteer'
import {IState} from '../../lib/typedefs'
import conf from '../../../shared/lib/conf'

module.exports = (state: IState) => {
  describe('initialize', () => {
    it('should start chrome', async () => {
      const headless = !process.env.DEBUG
      state.browser = await puppeteer.launch({headless})
      state.page = await state.browser.newPage()
    })
  })
}
