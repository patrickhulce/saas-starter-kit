/* tslint:disable */
import * as styles from './login.scss'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Tabs, {Tab} from 'material-ui/Tabs'
import TextField from 'material-ui/TextField/TextField'
import Button from 'material-ui/Button/Button'
import FormControlLabel from 'material-ui/Form/FormControlLabel'
import Checkbox from 'material-ui/Checkbox/Checkbox'
import FormHelperText from 'material-ui/Form/FormHelperText'

interface LoginPageState {
  selectedTab: number
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
        <TextField name="email" type="email" label="Email" autoFocus required />
        <TextField name="password" type="password" label="Password" required />
        <Button variant="raised" color="primary" type="submit">
          Login
        </Button>
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
        <div>
          <TextField name="first" type="first" label="First Name" className="half-text" required />
          <TextField name="last" type="last" label="Last Name" className="half-text" required />
        </div>
        <TextField name="email" type="email" label="Email" required />
        <TextField name="password" type="password" label="Password" required />
        <TextField name="cpassword" type="password" label="Confirm Password" required />
        <FormControlLabel
          control={<Checkbox name="newsletter" value="newsletter" color="primary" />}
          label="Send me tips and updates (unsubscribe anytime)"
        />
        <FormHelperText className={styles.tos} >
          By registering, you agree to our <a href="TOS_URL">terms of service</a>
        </FormHelperText>
        <Button variant="raised" color="primary" type="submit">
          Register
        </Button>
      </form>
    )
  }
}

class LoginPage extends React.Component<{}, LoginPageState> {
  state = {selectedTab: 0}

  render() {
    const onChange = (evt, value) => this.setState({selectedTab: value})

    return [
      <h1 className="app-name">THE_PRODUCT_DISPLAY_NAME</h1>,
      <div className="account-forms">
        <Tabs
          value={this.state.selectedTab}
          onChange={onChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label="Login" />
          <Tab label="Create an Account" />
        </Tabs>
        {this.state.selectedTab === 0 && <LoginForm />}
        {this.state.selectedTab === 1 && <RegisterForm />}
      </div>,
    ]
  }
}

// HACK: let the CSS kick-in before rendering
setTimeout(() => {
  ReactDOM.render(<LoginPage />, document.getElementById('app-root'))
}, 0)

const anyModule = module as any
if (anyModule.hot) {
  anyModule.hot.accept(() => ReactDOM.render(<LoginPage />, document.getElementById('app-root')))
}
