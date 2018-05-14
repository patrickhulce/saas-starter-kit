import {IState} from '../../lib/typedefs'
import {Mailslurp} from '../../lib/mailslurp'
import conf from '../../../shared/lib/conf'

module.exports = (state: IState) => {
  const mailslurp = new Mailslurp(conf.mailslurp.apiKey)

  async function typeIn(formEl, text) {
    const $el = await state.page.$(formEl)
    await $el.type(text)
  }

  describe('create account', () => {
    it('should prep a fake inbox', async () => {
      state.userMailbox = await mailslurp.createInbox()
    })

    it('should navigate to login page', async () => {
      await state.page.goto(`${state.rootURL}/login`, {waitUntil: 'load'})
      await state.page.waitFor('#app-root')
    })

    it('should switch to create account tab', async () => {
      await state.page.waitFor(state.waitFor)
      const $createAccountTab = await state.page.$('[data-testid=create-account-tab]')
      await $createAccountTab.click()
      await state.page.waitFor('form[name=register]')
    })

    it('should fill in form', async () => {
      await state.page.waitFor(state.waitFor)
      await typeIn('input[name=first]', 'John')
      await typeIn('input[name=last]', 'User')
      await typeIn('input[name=email]', state.userMailbox.address)
      await typeIn('input[name=password]', 'test_password')
      await typeIn('input[name=cpassword]', 'test_password')
      await state.page.waitFor(state.waitFor)

      ;(await state.page.$('[data-testid=create-account-submit]')).click()
      await state.page.waitForNavigation()
    })

    it('should have created account', async () => {
      await state.page.waitFor(state.waitFor)

      const text = await state.page.evaluate(() => document.querySelector('h1').textContent)
      expect(text).toContain('Hello, John')
      state.user = {password: 'test_password'}
    })

    it('should send welcome email', async () => {
      expect(state.user).toBeDefined()
      const messages = await mailslurp.readMail(state.userMailbox, 1)

      expect(messages).toHaveLength(1)
      expect(messages[0].subject).toContain('Welcome')
      expect(messages[0].body).toContain('Hello John User,')
    })
  })
}
