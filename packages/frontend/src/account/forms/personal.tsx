import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import * as React from 'react'

import {IUser} from '../../../../shared/lib/typedefs'
import {BasicTextField} from '../../components/basic-text-field'
import {ErrorBar} from '../../components/error-bar/error-bar'
import {Form, IFormData} from '../../components/form'
import {LoadingBar} from '../../components/loading-bar/loading-bar'

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
  public render(): JSX.Element[] {
    return [
      <h2 key="header">Personal Information</h2>,
      <NamesForm key="names-form" user={this.props.user} />,
    ]
  }
}
