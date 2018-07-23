import * as React from 'react'

import {IUser} from '../../../../shared/lib/typedefs'
import {Form, IFormData, IFormState, ISubmitOptions} from '../../components/form/form'
import * as formStyles from '../../components/form/form.scss'
import {requestPasswordReset} from '../../services/user-service'

class PasswordResetForm extends Form<{user: IUser}> {
  public state: IFormState = {}
  public submitUIOptions: ISubmitOptions = {label: 'Request Password Reset'}

  protected async _handleSubmit(data: IFormData): Promise<void> {
    await requestPasswordReset(this.props.user.email)
    this.setState({successMessage: 'Password reset email sent'})
  }

  public renderInputUI(): JSX.Element {
    return <React.Fragment />
  }
}

export class PasswordForm extends React.Component<{user: IUser}> {
  public render(): JSX.Element {
    const formClasses = `${formStyles.columnarForm} ${formStyles.fixedWidth}`
    return (
      <React.Fragment>
        <h2>Password</h2>
        <PasswordResetForm user={this.props.user} className={formClasses} />
      </React.Fragment>
    )
  }
}
