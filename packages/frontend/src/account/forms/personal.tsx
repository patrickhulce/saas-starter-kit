import * as React from 'react'

import {IUser} from '../../../../shared/lib/typedefs'
import {BasicTextField} from '../../components/basic-text-field'
import {Form, IFormData} from '../../components/form'
import {updateAccount} from '../../services/user-service'

interface INamesFormState {
  isLoading?: boolean
  errorMessage?: string
}

class NamesForm extends Form<{user: IUser}, INamesFormState> {
  public state: INamesFormState = {}

  protected async _handleSubmit(data: IFormData): Promise<void> {
    const user: IUser = {...this.props.user, firstName: data.first, lastName: data.last}
    await updateAccount(user)
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

export class PersonalForm extends React.Component<{user: IUser}> {
  public render(): JSX.Element {
    return (
      <React.Fragment>
        <h2>Personal Information</h2>
        <NamesForm user={this.props.user} />
      </React.Fragment>
    )
  }
}
