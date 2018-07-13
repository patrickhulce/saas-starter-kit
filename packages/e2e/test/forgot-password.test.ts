import 'pptr-testing-library/extend'
import {wait} from 'pptr-testing-library'
import {ElementHandle} from 'puppeteer'
import {IState} from '../lib/typedefs'
import {testIds} from '../../frontend/src/utils'

describe('Forgot Password Flow', () => {
  const state: IState = {}

  let $document: ElementHandle
  let resetPasswordLink: string

  require('./steps/initialize.test')(state)

  describe('reset password', () => {
    it('should navigate to login page', async () => {
      await state.page.goto(`${state.rootURL}/login`)
      $document = await (await state.page.getDocument()).$('#app-root')
    })

    it('should click forgot password', async () => {
      const $forgotPasswordBtn = await $document.getByText(/Forgot password/)
      await $forgotPasswordBtn.click()
      await wait(() => $document.getByText(/Send Reset/))
    })

    it('should render the forgot password page', async () => {
      expect(await state.page.screenshot()).toMatchImageSnapshot()
    })

    it('should fill in form', async () => {
      await (await $document.getByLabelText(/Email/)).type(state.login.email)
      await state.page.waitFor(state.waitFor)

      const $submit = await $document.getByTestId(testIds.loginFormPrimaryBtn)
      await $submit.click()
    })

    it('should have received forgot password email', async () => {
      const messages = await state.mail.readMail(state.userMailbox, 2)

      expect(messages).toHaveLength(2)
      expect(messages[1].subject).toContain('Password Reset')
      expect(messages[1].body).toContain('password')
      resetPasswordLink = messages[1].body.match(/>http[^\s<]+/)[0].slice(1)
    })

    it('should load reset password screen', async () => {
      expect(resetPasswordLink).toBeDefined()
      await state.page.goto(resetPasswordLink)
      $document = await state.page.getDocument()
    })

    it('should render the reset password page', async () => {
      expect(await state.page.screenshot()).toMatchImageSnapshot()
    })

    it('should fill in form', async () => {
      await (await $document.getByLabelText(/^Password/)).type('new_password1')
      await (await $document.getByLabelText(/Confirm Password/)).type('new_password1')
      await state.page.waitFor(state.waitFor)

      const $submit = await $document.getByText(/Reset/)
      $submit.click()
      await state.page.waitForNavigation()
    })

    it('should login with new password', async () => {
      $document = await (await state.page.getDocument()).$('#app-root')
      await (await $document.getByLabelText(/Email/)).type(state.login.email)
      await (await $document.getByLabelText(/Password/)).type('new_password1')
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
  })

  require('./steps/teardown.test')(state)
})
