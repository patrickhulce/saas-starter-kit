import * as styles from '../login.scss'
import * as React from 'react'
import TextField from 'material-ui/TextField/TextField'
import Button from 'material-ui/Button/Button'
import FormControlLabel from 'material-ui/Form/FormControlLabel'
import Checkbox from 'material-ui/Checkbox/Checkbox'
import FormHelperText from 'material-ui/Form/FormHelperText'
import {Form} from '../../components/form'
import {login} from './login'
import conf from '../../../../shared/lib/conf'
import {ErrorBar} from '../../components/error-bar/error-bar'

async function createAccount(
  accountName: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<any> {
  const response = await fetch('/api/v1/accounts/register', {
    method: 'POST',
    body: JSON.stringify({
      account: {name: accountName},
      user: {firstName, lastName, email, password},
    }),
    headers: {'content-type': 'application/json'},
  })

  if (response.status !== 200) {
    // TODO: Provide more specific error message
    throw new Error('Error creating account')
  }

  await login(email, password)
}

export interface IRegisterFormState {
  errorMessage?: string
}

export class RegisterForm extends Form<IRegisterFormState> {
  public async _handleSubmit(data: any): Promise<void> {
    if (data.cpassword !== data.password) {
      this.setState({errorMessage: 'Passwords did not match'})
      return
    }

    try {
      await createAccount(
        `${data.first} ${data.last}'s Account`,
        data.first,
        data.last,
        data.email,
        data.password,
      )
    } catch (err) {
      this.setState({errorMessage: 'Error creating account'})
    }
  }

  public render(): JSX.Element {
    const newsletterLabel = (
      <span className={styles.newsletter}>
        Send me email tips and updates
        <small>(Roughly once a month, unsubscribe anytime)</small>
      </span>
    )

    return (
      <form name="register" onSubmit={this.handleSubmit}>
        <ErrorBar message={this.state.errorMessage} />
        <div>
          <TextField name="first" label="First Name" className={styles.halfText} required />
          <TextField name="last" label="Last Name" className={styles.halfText} required />
        </div>
        <TextField name="email" type="email" label="Email" required />
        <TextField name="password" type="password" label="Password" required />
        <TextField name="cpassword" type="password" label="Confirm Password" required />
        <FormControlLabel
          control={<Checkbox name="newsletter" value="newsletter" color="primary" />}
          label={newsletterLabel}
        />
        <FormHelperText className={styles.tos}>
          By registering, you agree to our{' '}
          <a target="_blank" href={conf.termsOfServiceURL}>
            terms of service
          </a>
        </FormHelperText>
        <Button data-testid="create-account-submit" variant="raised" color="primary" type="submit">
          Register
        </Button>
      </form>
    )
  }
}
