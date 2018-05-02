import {IState} from '../../lib/typedefs'
import { Mailslurp } from '../../lib/mailslurp';
import conf from '../../../shared/lib/conf';

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
      const $createAccountTab = await state.page.$('.atmn-create-account')
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

      ;(await state.page.$('.atmn-create-account-submit')).click()
      await state.page.waitForNavigation()
    })

    it('should redirect to app', async () => {
      await state.page.waitFor(state.waitFor)

      const content = await state.page.content()
      expect(content).toContain('Hello, John')
    })

    it('should send welcome email', async () => {
      const messages = await mailslurp.readMail(state.userMailbox, 1)

      expect(messages).toHaveLength(1)
      expect(messages[0].subject).toContain('Welcome')
      expect(messages[0].body).toContain('Hello John User,')
    })
  })
}
