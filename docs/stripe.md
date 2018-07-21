# Accepting Payments with Stripe

1.  [Create an account](https://dashboard.stripe.com/)
2.  [Create a test product in the UI](https://dashboard.stripe.com/test/products)
3.  Add your test keys to `.envrc.local` and real keys to prod.
4.  [Create plans](https://stripe.com/docs/api#create_plan) for each of your `AccountPlan` values, for annual discounts add `--annual`.
