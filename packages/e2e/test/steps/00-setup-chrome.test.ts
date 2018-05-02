import * as puppeteer from 'puppeteer'
import {IState} from '../../lib/typedefs'
import conf from '../../../shared/lib/conf'

module.exports = (state: IState) => {
  describe('initialize', () => {
    it('should start chrome', async () => {
      state.browser = await puppeteer.launch()
      state.page = await state.browser.newPage()
    })

    it('should navigate to page', async () => {
      await state.page.goto(state.rootURL, {waitUntil: 'load'})
      await state.page.waitFor('#app-root')
    })

    it('should have content', async () => {
      await state.page.waitFor(state.waitFor)
      const appName = await state.page.evaluate(
        () => document.querySelector('.app-name').textContent,
      )
      expect(appName).toContain(conf.displayName)
    })
  })
}
