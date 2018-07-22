import conf from '../../shared/lib/conf'
import {AccountPlan} from '../../shared/lib/typedefs'

import {IState} from './typedefs'

describe('update payment', () => {
  const state: IState = {}

  let customer: any
  let createCustomerFn: jest.Mock

  beforeAll(() => {
    customer = {id: `stripe-customer-id-${Date.now()}`}
    createCustomerFn = jest.fn().mockResolvedValue(customer)
    __stripe.customers = {create: createCustomerFn}
  })

  require('./steps/initialize.test')(state)
  require('./steps/account-setup.test')(state)

  describe('update payment', () => {
    it('should reject unauthenticated', async () => {
      const response = await fetch(
        `${state.apiURL}/v1/accounts/${state.account.id}/payment-method`,
        {
          method: 'PUT',
          body: JSON.stringify({plan: AccountPlan.Gold, stripeSourceId: 'stripe-source-id'}),
          headers: {'content-type': 'application/json'},
        },
      )

      expect(response.status).toBe(401)
    })

    it('should reject attempts to update other accounts', async () => {
      const response = await fetch(
        `${state.apiURL}/v1/accounts/${state.account.id - 1}/payment-method`,
        {
          method: 'PUT',
          body: JSON.stringify({plan: AccountPlan.Gold, stripeSourceId: 'stripe-source-id'}),
          headers: {
            'content-type': 'application/json',
            cookie: `token=${state.token}`,
          },
        },
      )

      expect(response.status).toBe(403)
    })

    it('should update payment method', async () => {
      const response = await fetch(
        `${state.apiURL}/v1/accounts/${state.account.id}/payment-method`,
        {
          method: 'PUT',
          body: JSON.stringify({plan: AccountPlan.Silver, stripeSourceId: 'stripe-source-id'}),
          headers: {'content-type': 'application/json', cookie: `token=${state.token}`},
        },
      )

      expect(response.status).toBe(204)
    })

    it('should have updated stripe data', () => {
      expect(createCustomerFn).toHaveBeenCalled()
      expect(createCustomerFn.mock.calls[0]).toMatchSnapshot()
    })

    it('should have updated plan', async () => {
      const headers = {cookie: `token=${state.token}`}
      const response = await fetch(`${state.apiURL}/v1/accounts/${state.account.id}`, {headers})
      expect(await response.json()).toMatchObject({plan: AccountPlan.Silver, stripeId: customer.id})
    })
  })

  require('./steps/teardown.test')(state)
})
