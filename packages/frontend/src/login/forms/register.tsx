import Checkbox from '@material-ui/core/Checkbox/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import * as React from 'react'

import conf from '../../../../shared/lib/conf'
import {BasicTextField} from '../../components/basic-text-field'
import {Form, IFormState, ISubmitOptions} from '../../components/form'
import {testIds} from '../../utils'
import * as styles from '../login.scss'

import {login} from './login'

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

export class RegisterForm extends Form {
  public state: IFormState = {}
  public testId: string = testIds.registerForm
  public submitUIOptions: ISubmitOptions = {label: 'Register', testId: testIds.createAccountSubmit}

  protected async _handleSubmit(data: any): Promise<void> {
    if (data.confirmPassword !== data.password) {
      throw new Error('Passwords did not match')
    }

    await createAccount(
      `${data.firstName} ${data.lastName}'s Account`,
      data.firstName,
      data.lastName,
      data.email,
      data.password,
    )
  }

  public renderInputUI(): JSX.Element {
    const newsletterLabel = (
      <span className={styles.newsletter}>
        Send me email tips and updates
        <small>(Roughly once a month, unsubscribe anytime)</small>
      </span>
    )

    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  }
}
