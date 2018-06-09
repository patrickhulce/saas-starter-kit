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
import {BasicTextField} from '../../components/basic-text-field'
import {testIds} from '../../utils'

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

export class RegisterForm extends Form<{}, IRegisterFormState> {
  state: IRegisterFormState = {}

  protected async _handleSubmit(data: any): Promise<void> {
    if (data.confirmPassword !== data.password) {
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
      <form name="register" onSubmit={this.handleSubmit} data-testid={testIds.registerForm}>
        <LoadingBar isLoading={this.state.isLoading} />
        <ErrorBar message={this.state.errorMessage} />
        <div>
          <BasicTextField name="firstName" className={styles.halfText} autoFocus />
          <BasicTextField name="lastName" className={styles.halfText} />
        </div>
        <BasicTextField name="email" type="email" />
        <BasicTextField name="password" type="password" />
        <BasicTextField name="confirmPassword" type="password" />
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
        <Button
          data-testid={testIds.createAccountSubmit}
          variant="raised"
          color="primary"
          type="submit"
        >
          Register
        </Button>
      </form>
    )
  }
}
