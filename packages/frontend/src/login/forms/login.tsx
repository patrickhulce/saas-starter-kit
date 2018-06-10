import * as React from 'react'

import {BasicTextField} from '../../components/basic-text-field'
import {Form, IFormData, IFormState, ISubmitOptions} from '../../components/form'
import {testIds} from '../../utils'

export async function login(email: string, password: string): Promise<void> {
  const authResponse = await fetch('/api/v1/oauth/token', {
    method: 'POST',
    body: JSON.stringify({username: email, password, grant_type: 'password'}),
    headers: {'content-type': 'application/json'},
    credentials: 'same-origin',
  })

  if (authResponse.status !== 200) {
    throw new Error('Unauthorized')
  }

  const userResponse = await fetch('/api/v1/users/me', {credentials: 'same-origin'})
  if (userResponse.status !== 200) {
    throw new Error('Invalid User')
  }

  const user = await userResponse.json()
  localStorage.setItem('loggedInUser', JSON.stringify(user))
  window.location.href = '/'
}

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
