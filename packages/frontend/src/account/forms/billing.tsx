import * as React from 'react'
import {CardElement, Elements, StripeProvider, injectStripe} from 'react-stripe-elements'

import {AccountPlan, IUser} from '../../../../shared/lib/typedefs'
import {BasicTextField} from '../../components/basic-text-field'
import {Form, IFormData, IFormState, ISubmitOptions} from '../../components/form/form'
import * as formStyles from '../../components/form/form.scss'
import {updatePaymentMethod} from '../../services/user-service'
import * as styles from '../account.scss'

import {testIds} from '../../utils'

const stripeUIOptions = {
  base: {
    fontSize: '16px',
    color: '#424770',
    letterSpacing: '0.025em',
    padding: '5px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#9e2146',
  },
}

class PaymentMethodFormUnconnected extends Form<{user: IUser}> {
  public state: IFormState = {}
  public testId: string = testIds.paymentForm
  public submitUIOptions: ISubmitOptions = {label: 'Update Payment Method'}

  protected async _handleSubmit(data: IFormData): Promise<void> {
    const {email, accountId} = this.props.user
    const stripe = (this.props as any).stripe
    const {source, error} = await stripe.createSource({
      type: 'card',
      currency: 'usd',
      owner: {email},
    })

    if (error) throw error

    // TODO: let user pick plan, https://github.com/patrickhulce/saas-starter-kit/issues/37
    await updatePaymentMethod(accountId, source.id, AccountPlan.Gold, {
      line1: data.addressLine1,
      line2: data.addressLine2,
      city: data.city,
      state: data.state,
      postal_code: data.zipcode,
      country: 'US',
    })

    this.setState({successMessage: 'Payment details saved'})
  }

  public renderInputUI(): JSX.Element {
    return (
      <React.Fragment>
        <BasicTextField name="addressLine1" />
        <BasicTextField name="addressLine2" required={false} />
        <div>
          <BasicTextField name="city" style={{width: '50%'}} />
          <BasicTextField name="state" style={{width: '30%'}} />
          <BasicTextField name="zipcode" style={{width: '20%'}} />
        </div>
        <CardElement style={stripeUIOptions} />
      </React.Fragment>
    )
  }
}

// tslint:disable-next-line
const PaymentMethodForm = injectStripe(PaymentMethodFormUnconnected)

export class BillingForm extends React.Component<{user: IUser}> {
  public render(): JSX.Element {
    const stripeKey = (window as any).STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY || ''
    return (
      <React.Fragment>
        <h2>Billing</h2>
        <StripeProvider apiKey={stripeKey}>
          <Elements>
            <PaymentMethodForm
              user={this.props.user}
              className={`${styles.billing} ${formStyles.columnarForm}`}
            />
          </Elements>
        </StripeProvider>
      </React.Fragment>
    )
  }
}
