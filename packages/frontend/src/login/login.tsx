import * as React from 'react'
import {Form} from './form'
import Tabs, {Tab} from 'material-ui/Tabs'
import TextField from 'material-ui/TextField/TextField'
import Button from 'material-ui/Button/Button'
import {ErrorBar} from '../components/error-bar/error-bar'

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
  public async _handleSubmit(data: any): Promise<void> {
    try {
      await login(data.email, data.password)
    } catch (err) {
      this.setState({errorMessage: 'Invalid login'})
    }
  }

  public render(): JSX.Element {
    return (
      <form name="login" onSubmit={this.handleSubmit}>
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
