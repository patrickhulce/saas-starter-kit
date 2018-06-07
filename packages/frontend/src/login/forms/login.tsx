import * as React from 'react'
import TextField from '@material-ui/core/TextField/TextField'
import Button from '@material-ui/core/Button/Button'
import {Form, IFormData} from '../../components/form'
import {ErrorBar} from '../../components/error-bar/error-bar'
import {LoadingBar} from '../../components/loading-bar/loading-bar'

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

export interface ILoginFormState {
  isLoading?: boolean
  errorMessage?: string
}

export class LoginForm extends Form<ILoginFormState> {
  public async _handleSubmit(data: IFormData): Promise<void> {
    try {
      this.setState({isLoading: true})
      await login(data.email, data.password)
    } catch (err) {
      this.setState({errorMessage: 'Invalid login'})
    } finally {
      this.setState({isLoading: false})
    }
  }

  public render(): JSX.Element {
    return (
      <form name="login" onSubmit={this.handleSubmit} data-testid="login-form">
        <LoadingBar isLoading={this.state.isLoading} />
        <ErrorBar message={this.state.errorMessage} />
        <TextField name="email" type="email" label="Email" autoFocus required />
        <TextField name="password" type="password" label="Password" required />
        <Button variant="raised" color="primary" type="submit">
          Login
        </Button>
      </form>
    )
  }
}
