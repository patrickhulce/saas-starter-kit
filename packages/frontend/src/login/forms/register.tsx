import Checkbox from '@material-ui/core/Checkbox/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import * as React from 'react'

import conf from '../../../../shared/lib/conf'
import {BasicTextField} from '../../components/basic-text-field'
import {Form, IFormState, ISubmitOptions} from '../../components/form/form'
import * as formStyles from '../../components/form/form.scss'
import {createAccount} from '../../services/user-service'
import {testIds} from '../../utils'
import * as styles from '../login.scss'

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
          <BasicTextField name="firstName" className={formStyles.halfText} autoFocus />
          <BasicTextField name="lastName" className={formStyles.halfText} />
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
