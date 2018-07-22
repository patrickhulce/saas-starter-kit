import * as Stripe from 'stripe'

import {accountExecutor} from '../../shared/lib'
import conf from '../../shared/lib/conf'
import {AccountPlan, IUser} from '../../shared/lib/typedefs'

// TODO: add stripe webhooks

export const stripe = new Stripe(conf.stripe.secretKey)

export async function createOrUpdateStripe(
  user: IUser,
  plan: AccountPlan,
  stripeSourceId: string,
): Promise<void> {
  const account = await accountExecutor.findByIdOrThrow(user.accountId)
  // TODO: update payment information too
  if (account.stripeId) {
    throw new Error('Update not yet supported')
  }

  const customer = await createStripeCustomer(user, plan, stripeSourceId)
  account.stripeId = customer.id
  // TODO: poll stripe until charge goes through
  account.plan = plan
  await accountExecutor.update(account)
}

async function createStripeCustomer(
  user: IUser,
  plan: AccountPlan,
  stripeSourceId: string,
): Promise<Stripe.customers.ICustomer> {
  return stripe.customers.create({
    email: user.email,
    description: `${user.firstName} ${user.lastName}`,
    metadata: {accountId: user.accountId, userId: user.id!},
    source: stripeSourceId,
    plan,
  })
}
