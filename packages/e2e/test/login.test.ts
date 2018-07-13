import 'pptr-testing-library/extend'
import {wait} from 'pptr-testing-library'
import {ElementHandle} from 'puppeteer'
import {IState} from '../lib/typedefs'
import {testIds} from '../../frontend/src/utils'

describe('Login Flow', () => {
  const state: IState = {}

  require('./steps/initialize.test')(state)

  let $document: ElementHandle

  // tslint:disable-next-line
  async function typeInByLabel(label, text) {
    const $el = await $document.getByLabelText(label)
    await $el.type(text)
  }

  describe('login', () => {
    it('should navigate to login page', async () => {
      await state.page.goto(`${state.rootURL}/login`)
      await state.page.waitFor('#app-root')
    })

    it('should render the login page', async () => {
      expect(await state.page.screenshot()).toMatchImageSnapshot()
    })

    it('should fill in form', async () => {
      const $document = await state.page.getDocument()
      await (await $document.getByLabelText(/Email/)).type(state.login.email)
      await (await $document.getByLabelText(/Password/)).type(state.login.password)
      await state.page.waitFor(state.waitFor)

      const $submit = await $document.getByTestId(testIds.loginFormPrimaryBtn)
      $submit.click()
      await state.page.waitForNavigation()
    })

    it('should have logged in', async () => {
      const pageURL = await state.page.evaluate(() => window.location.href)
      expect(pageURL).not.toContain('login')

      const text = await state.page.evaluate(() => document.querySelector('h1').textContent)
      expect(text).toContain('Hello,')
    })

    it('should render the app', async () => {
      expect(await state.page.screenshot()).toMatchImageSnapshot()
    })
  })

  require('./steps/teardown.test')(state)
})