import * as React from 'react'

import {IUser} from '../../../../shared/lib/typedefs'
import {BasicTextField} from '../../components/basic-text-field'
import {Form, IFormData} from '../../components/form'

async function updateAccount(user: IUser): Promise<void> {
  const response = await fetch(`/api/v1/users/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
    headers: {'content-type': 'application/json'},
  })

  if (response.status !== 200) {
    // TODO: Provide more specific error message
    throw new Error('Error updating account')
  }
}

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

  public render(): JSX.Element {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderLoadingUI()}
        <BasicTextField name="firstName" defaultValue={this.props.user.firstName} />
        <BasicTextField name="lastName" defaultValue={this.props.user.lastName} />
        {this.renderSubmitUI({label: 'Update'})}
      </form>
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
