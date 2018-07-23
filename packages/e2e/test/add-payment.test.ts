import {wait} from 'pptr-testing-library'
import 'pptr-testing-library/extend'
import {ElementHandle} from 'puppeteer'

import {testIds} from '../../frontend/src/utils'
import {IState} from '../lib/typedefs'

// from https://stripe.com/docs/testing#cards
const TEST_MASTERCARD = '5555555555554444'

describe('Add Payment Flow', () => {
  const state: IState = {}

  require('./steps/initialize.test')(state)
  require('./steps/login.test')(state)

  if (state.offline) {
    it.skip('should have tested stripe integration', jest.fn())
    return
  }

  let $document: ElementHandle

  async function typeInByLabel(label: RegExp, text: string): Promise<void> {
    const $el = await $document.getByLabelText(label)
    await $el.type(text)
  }

  async function getStripeFrame(): Promise<ElementHandle> {
    const frames = await state.page.frames()
    const stripeFrame = frames.find(frame => {
      const url = frame.url()
      return url.includes('stripe') && url.includes('elements-inner-card')
    })
    return stripeFrame.$('body')
  }

  describe('add payment', () => {
    beforeEach(async () => {
      $document = await state.page.getDocument()
    })

    it('should navigate to account page', async () => {
      await state.page.goto(`${state.rootURL}/account`)
    })

    it('should switch to billing tab', async () => {
      await state.page.waitFor(state.waitFor)
      const $billingTab = await $document.getByTestId(testIds.billingTab)
      await $billingTab.click()
      await wait(() => $document.getByTestId(testIds.paymentForm))
    })

    it('should fill in form', async () => {
      await state.page.waitFor(state.waitFor)
      await typeInByLabel(/Line 1/, '123 Main St')
      await typeInByLabel(/Line 2/, 'Company Suite 102')
      await typeInByLabel(/City/, 'Dallas')
      await typeInByLabel(/State/, 'TX')
      await typeInByLabel(/Zip/, '75201')
    })

    it('should fill in stripe', async () => {
      await state.page.waitFor(state.waitFor)

      const stripe = await getStripeFrame()
      await (await stripe.getByPlaceholderText(/Card/)).type(TEST_MASTERCARD, {delay: 25})
      await (await stripe.getByPlaceholderText(/MM.*YY/)).type('12/22')
      await (await stripe.getByPlaceholderText(/CVC/)).type('123')
      await (await stripe.getByPlaceholderText(/Zip/i)).type('75201')

      await state.page.waitFor(state.waitFor)
    })

    it('should render the billing page', async () => {
      expect(await state.page.screenshot()).toMatchImageSnapshot()
    })

    it.skip('should submit the form', async () => {
      const $submit = await $document.getByTestId(testIds.defaultSubmitBtn)
      await $submit.click()
    })

    it.skip('should have added payment', async () => {
      await state.page.waitFor(state.waitFor)

      const text = await state.page.evaluate(() => document.querySelector('h1').textContent)
      expect(text).toContain('Hello, John')
      state.login = {email: state.userMailbox.address, password: 'test_password'}
    })
  })

  require('./steps/teardown.test')(state)
})
