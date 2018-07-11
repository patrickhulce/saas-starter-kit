import 'pptr-testing-library/extend'
import {wait} from 'pptr-testing-library'
import {ElementHandle} from 'puppeteer'
import {IState} from '../../lib/typedefs'
import {testIds} from '../../../frontend/src/utils'

module.exports = (state: IState) => {
  let $document: ElementHandle

  // tslint:disable-next-line
  async function typeInByLabel(label, text) {
    const $el = await $document.getByLabelText(label)
    await $el.type(text)
  }

  describe('create account', () => {
    beforeEach(async () => {
      $document = await state.page.getDocument()
    })

    it('should prep a fake inbox', async () => {
      state.userMailbox = await state.mail.createInbox()
    })

    it('should navigate to login page', async () => {
      await state.page.goto(`${state.rootURL}/login`)
      await state.page.waitFor('#app-root')
    })

    it('should render the login page', async () => {
      expect(await state.page.screenshot()).toMatchImageSnapshot()
    })

    it('should switch to create account tab', async () => {
      await state.page.waitFor(state.waitFor)
      const $createAccountTab = await $document.getByTestId(testIds.createAccountTab)
      await $createAccountTab.click()
      await wait(() => $document.getByTestId(testIds.registerForm))
    })

    it('should render the account page', async () => {
      expect(await state.page.screenshot()).toMatchImageSnapshot()
    })

    it('should fill in form', async () => {
      await state.page.waitFor(state.waitFor)
      await typeInByLabel(/First Name/, 'John')
      await typeInByLabel(/Last Name/, 'User')
      await typeInByLabel(/Email/, state.userMailbox.address)
      await typeInByLabel(/^Password/, 'test_password')
      await typeInByLabel(/Confirm Password/, 'test_password')
      await state.page.waitFor(state.waitFor)
      const $submit = await $document.getByTestId(testIds.createAccountSubmit)
      $submit.click()
      await state.page.waitForNavigation()
    })

    it('should have created account', async () => {
      await state.page.waitFor(state.waitFor)

      const text = await state.page.evaluate(() => document.querySelector('h1').textContent)
      expect(text).toContain('Hello, John')
      state.login = {email: state.userMailbox.address, password: 'test_password'}
    })

    it('should send welcome email', async () => {
      expect(state.login).toBeDefined()
      const messages = await state.mail.readMail(state.userMailbox, 1)

      expect(messages).toHaveLength(1)
      expect(messages[0].subject).toContain('Welcome')
      expect(messages[0].body).toContain('Hello John User,')
      state.emailVerificationLink = messages[0].body.match(/>http[^\s<]+/)[0].slice(1)
    })

    it('should visit verification link', async () => {
      expect(state.emailVerificationLink).toBeDefined()
      await state.page.goto(state.emailVerificationLink)

      const pageURL = await state.page.evaluate(() => window.location.href)
      expect(pageURL).toContain('verification=success')
    })

    it('should render the app', async () => {
      expect(await state.page.screenshot()).toMatchImageSnapshot()
    })
  })
}
