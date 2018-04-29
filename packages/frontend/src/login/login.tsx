import * as React from 'react'
import {Form} from './form'
import Tabs, {Tab} from 'material-ui/Tabs'
import TextField from 'material-ui/TextField/TextField'
import Button from 'material-ui/Button/Button'

export async function login(email: string, password: string): Promise<void> {
  const response = await fetch('/api/v1/oauth/token', {
    method: 'POST',
    body: JSON.stringify({username: email, password, grant_type: 'password'}),
    headers: {'content-type': 'application/json'},
    credentials: 'same-origin',
  })

  if (response.status !== 200) {
    throw new Error('Unauthorized')
  }

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
    const errMsg = this.state.errorMessage ? <div>{this.state.errorMessage}</div> : undefined
    return (
      <form name='login' onSubmit={this.handleSubmit}>
        {errMsg}
        <TextField name='email' type='email' label='Email' autoFocus required />
        <TextField name='password' type='password' label='Password' required />
        <Button variant='raised' color='primary' type='submit'>
          Login
        </Button>
      </form>
    )
  }
}
