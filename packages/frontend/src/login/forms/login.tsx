import Button from '@material-ui/core/Button'
import * as React from 'react'

import {BasicTextField} from '../../components/basic-text-field'
import {Form, IFormData, IFormState} from '../../components/form/form'
import {forgotPassword, login} from '../../services/user-service'
import {testIds} from '../../utils'
import * as styles from '../login.scss'

export interface ILoginFormState extends IFormState {
  showForgotPasswordUI: boolean
}

export class LoginForm extends Form<{}, ILoginFormState> {
  public state: ILoginFormState = {showForgotPasswordUI: false}
  public testId: string = testIds.loginForm

  protected async _handleSubmit(data: IFormData): Promise<void> {
    if (this.state.showForgotPasswordUI) {
      await forgotPassword(data.email)
      this.setState({showForgotPasswordUI: false})
      // TODO: show success message
      return
    }

    try {
      await login(data.email, data.password)
    } catch (err) {
      throw new Error('Invalid login')
    }
  }

  public renderSubmitUI(): JSX.Element {
    const {showForgotPasswordUI} = this.state

    let primaryLabel = 'Login'
    let secondaryLabel = 'Forgot password?'
    if (showForgotPasswordUI) {
      primaryLabel = 'Send Reset Email'
      secondaryLabel = 'Return to Login'
    }

    const secondaryAction = () => this.setState({showForgotPasswordUI: !showForgotPasswordUI})

    return (
      <React.Fragment>
        <Button
          variant="raised"
          color="primary"
          type="submit"
          disabled={!!this.state.isLoading}
          data-testid={testIds.loginFormPrimaryBtn}
        >
          {primaryLabel}
        </Button>
        <Button
          variant="raised"
          type="button"
          disabled={!!this.state.isLoading}
          data-testid={testIds.loginFormSecondaryBtn}
          className={styles.forgotPassword}
          onClick={secondaryAction}
        >
          {secondaryLabel}
        </Button>
      </React.Fragment>
    )
  }

  public renderInputUI(): JSX.Element {
    return (
      <React.Fragment>
        <BasicTextField name="email" type="email" autoFocus />
        {this.state.showForgotPasswordUI ? '' : <BasicTextField name="password" type="password" />}
      </React.Fragment>
    )
  }
}
