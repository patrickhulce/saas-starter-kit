# Accepting Payments with Stripe

1.  [Create an account](https://dashboard.stripe.com/)
2.  [Create a test product](https://dashboard.stripe.com/test/subscriptions/products)
3.  [Create test plans](https://dashboard.stripe.com/test/plans/create) for each of your `AccountPlan` values, use format `<product>-<AccountPlan>[--annual]`.
4.  Add your [keys](https://dashboard.stripe.com/account/apikeys) to `.envrc.local`.
