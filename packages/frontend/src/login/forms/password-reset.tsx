import * as React from 'react'

import {BasicTextField} from '../../components/basic-text-field'
import {Form, IFormData, IFormState, ISubmitOptions} from '../../components/form/form'
import {resetPassword} from '../../services/user-service'

export class PasswordResetForm extends Form {
  public state: IFormState = {}
  public submitUIOptions: ISubmitOptions = {label: 'Reset Password'}

  protected async _handleSubmit(data: IFormData): Promise<void> {
    if (data.confirmPassword !== data.password) {
      throw new Error('Passwords did not match')
    }

    const key = new URLSearchParams(window.location.search).get('reset-password-key')
    if (!key) throw new Error('Password reset key expired')
    await resetPassword(key, data.password)
  }

  public renderInputUI(): JSX.Element {
    return (
      <React.Fragment>
        <BasicTextField name="password" type="password" autoFocus />
        <BasicTextField name="confirmPassword" type="password" autoFocus />
      </React.Fragment>
    )
  }
}
