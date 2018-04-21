/* tslint:disable */
import './login.scss'
import * as React from 'react'
import ReactDOM = require('react-dom');

function createAccount(
  accountName: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<any> {
  return fetch('/api/v1/accounts/register', {
    method: 'POST',
    body: JSON.stringify({
      account: {name: accountName},
      user: {firstName, lastName, email, password},
    }),
    headers: {'content-type': 'application/json'},
  })
}

async function login(email: string, password: string) {
  const response = await fetch('/api/v1/oauth/token', {
    method: 'POST',
    body: JSON.stringify({username: email, password, grant_type: 'password'}),
    headers: {'content-type': 'application/json'},
    credentials: 'same-origin',
  })

  if (response.status !== 200) {
    throw new Error('Unauthorized')
  }

  (window as any).location = '/'
}

class Form extends React.Component<object, any> {
  constructor(props) {
    super(props)
    this.state = {}
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(evt: any) {
    evt.preventDefault()
    const data = {}
    for (const [prop, val] of new FormData(evt.target).entries()) {
      data[prop] = val
    }

    this._handleSubmit(data)
  }

  _handleSubmit(data: any) {
    throw new Error('Unimplemented')
  }
}

class LoginForm extends Form {
  async _handleSubmit(data: any) {
    try {
      await login(data.email, data.password)
    } catch (err) {
      this.setState({errorMessage: 'Invalid login'})
    }
  }

  render() {
    const errMsg = this.state.errorMessage ? <div>{this.state.errorMessage}</div> : undefined
    return (
      <form name="login" onSubmit={this.handleSubmit}>
        {errMsg}
        <label htmlFor="email">
          Email: <input name="email" type="email" required />
        </label>
        <label htmlFor="password">
          Password: <input name="password" type="password" required />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

ReactDOM.render(
  <LoginForm/>,
  document.getElementById('app-root')
)
