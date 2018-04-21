/* tslint:disable */
import './login.scss'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface LoginPageState {
  view: 'login' | 'register'
  errorMessage?: string
}

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
    const data = await response.json()
    throw new Error('Error creating account')
  }
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

  ;(window as any).location = '/'
}

class Form extends React.Component<{}, any> {
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

class RegisterForm extends Form {
  async _handleSubmit(data: any) {
    if (data.cpassword !== data.password) {
      this.setState({errorMessage: 'Passwords did not match'})
      return
    }

    try {
      await createAccount(
        `${data.first} ${data.last}'s Account`,
        data.first,
        data.last,
        data.email,
        data.password,
      )
    } catch (err) {
      this.setState({errorMessage: 'Error creating account'})
    }
  }

  render() {
    const errMsg = this.state.errorMessage ? <div>{this.state.errorMessage}</div> : undefined
    return (
      <form name="register" onSubmit={this.handleSubmit}>
        {errMsg}
        <label htmlFor="first">
          First Name: <input name="first" type="text" required />
        </label>
        <label htmlFor="last">
          Last Name: <input name="last" type="text" required />
        </label>
        <label htmlFor="email">
          Email: <input name="email" type="email" required />
        </label>
        <label htmlFor="password">
          Password: <input name="password" type="password" required />
        </label>
        <label htmlFor="cpassword">
          Confirm Password: <input name="cpassword" type="password" required />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

class LoginPage extends React.Component<{}, LoginPageState> {
  constructor(props) {
    super(props)
    this.state = {view: 'login'}
  }

  render() {
    let form
    let buttonText
    let buttonAction
    if (this.state.view === 'login') {
      form = <LoginForm />
      buttonText = 'Need an account?'
      buttonAction = 'register'
    } else {
      form = <RegisterForm />
      buttonText = 'Already registered?'
      buttonAction = 'login'
    }

    return (
      <div>
        {form}
        <button onClick={() => this.setState({view: buttonAction})}>{buttonText}</button>
      </div>
    )
  }
}

ReactDOM.render(<LoginPage />, document.getElementById('app-root'))
