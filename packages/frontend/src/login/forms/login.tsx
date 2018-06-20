import * as React from 'react'

import {BasicTextField} from '../../components/basic-text-field'
import {Form, IFormData, IFormState, ISubmitOptions} from '../../components/form/form'
import {login} from '../../services/user-service'
import {testIds} from '../../utils'

export class LoginForm extends Form {
  public state: IFormState = {}
  public testId: string = testIds.loginForm
  public submitUIOptions: ISubmitOptions = {label: 'Login'}

  protected async _handleSubmit(data: IFormData): Promise<void> {
    try {
      await login(data.email, data.password)
    } catch (err) {
      throw new Error('Invalid login')
    }
  }

  public renderInputUI(): JSX.Element {
    return (
      <React.Fragment>
        <BasicTextField name="email" type="email" autoFocus />
        <BasicTextField name="password" type="password" />
      </React.Fragment>
    )
  }
}
