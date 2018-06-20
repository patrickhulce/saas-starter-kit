import * as React from 'react'

import {IUser} from '../../../../shared/lib/typedefs'
import {BasicTextField} from '../../components/basic-text-field'
import {Form, IFormData, IFormState} from '../../components/form/form'
import * as formStyles from '../../components/form/form.scss'
import {updateAccount} from '../../services/user-service'
import {testIds} from '../../utils'

class NamesForm extends Form<{user: IUser}> {
  public state: IFormState = {}
  public testId: string = testIds.profileNamesForm

  protected async _handleSubmit(data: IFormData): Promise<void> {
    await updateAccount(this.props.user.id, {firstName: data.firstName, lastName: data.lastName})
  }

  public renderInputUI(): JSX.Element {
    return (
      <React.Fragment>
        <BasicTextField name="firstName" defaultValue={this.props.user.firstName} />
        <BasicTextField name="lastName" defaultValue={this.props.user.lastName} />
      </React.Fragment>
    )
  }
}

export class ProfileForm extends React.Component<{user: IUser}> {
  public render(): JSX.Element {
    const formClasses = `${formStyles.columnarForm} ${formStyles.fixedWidth}`
    return (
      <React.Fragment>
        <h2>Personal Information</h2>
        <NamesForm user={this.props.user} className={formClasses} />
      </React.Fragment>
    )
  }
}
