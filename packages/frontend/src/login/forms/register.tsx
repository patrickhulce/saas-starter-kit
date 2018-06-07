import * as styles from '../login.scss'
import * as React from 'react'
import TextField from '@material-ui/core/TextField/TextField'
import Button from '@material-ui/core/Button/Button'
import Checkbox from '@material-ui/core/Checkbox/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import {Form} from '../../components/form'
import {login} from './login'
import conf from '../../../../shared/lib/conf'
import {ErrorBar} from '../../components/error-bar/error-bar'
import {LoadingBar} from '../../components/loading-bar/loading-bar'

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
  isLoading?: boolean
  errorMessage?: string
}

const formInputs = {
  firstName: {id: 'first-name', name: 'first', label: 'First Name'},
  lastName: {id: 'last-name', name: 'last', label: 'Last Name'},
  email: {id: 'email', name: 'email', type: 'email', label: 'Email'},
  password: {id: 'pass', name: 'password', type: 'password', label: 'Password'},
  confirmPassword: {id: 'cpass', name: 'cpassword', type: 'password', label: 'Confirm Password'},
}

export class RegisterForm extends Form<IRegisterFormState> {
  public async _handleSubmit(data: any): Promise<void> {
    if (data.cpassword !== data.password) {
      this.setState({errorMessage: 'Passwords did not match'})
      return
    }

    try {
      this.setState({isLoading: true})
      await createAccount(
        `${data.first} ${data.last}'s Account`,
        data.first,
        data.last,
        data.email,
        data.password,
      )
    } catch (err) {
      this.setState({errorMessage: 'Error creating account'})
    } finally {
      this.setState({isLoading: false})
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
      <form name="register" onSubmit={this.handleSubmit} data-testid="register-form">
        <LoadingBar isLoading={this.state.isLoading} />
        <ErrorBar message={this.state.errorMessage} />
        <div>
          <TextField {...formInputs.firstName} className={styles.halfText} required />
          <TextField {...formInputs.lastName} className={styles.halfText} required />
        </div>
        <TextField {...formInputs.email} required />
        <TextField {...formInputs.password} required />
        <TextField {...formInputs.confirmPassword} required />
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
