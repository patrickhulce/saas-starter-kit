import * as styles from './login.scss'
import * as React from 'react'
import Tabs, {Tab} from 'material-ui/Tabs'
import TextField from 'material-ui/TextField/TextField'
import Button from 'material-ui/Button/Button'
import FormControlLabel from 'material-ui/Form/FormControlLabel'
import Checkbox from 'material-ui/Checkbox/Checkbox'
import FormHelperText from 'material-ui/Form/FormHelperText'
import {Form} from './form'
import {login} from './login'

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
    // TODO: Provide more specific error message
    throw new Error('Error creating account')
  }

  await login(email, password)
}

export class RegisterForm extends Form {
  public async _handleSubmit(data: any): Promise<void> {
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

  public render(): JSX.Element {
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
        <FormHelperText className={styles.tos}>
          By registering, you agree to our <a href="TOS_URL">terms of service</a>
        </FormHelperText>
        <Button
          className="atmn-create-account-submit"
          variant="raised"
          color="primary"
          type="submit"
        >
          Register
        </Button>
      </form>
    )
  }
}
