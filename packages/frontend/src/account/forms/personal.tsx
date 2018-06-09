import * as React from 'react'
import {IUser} from '../../../../shared/lib/typedefs'

export class PersonalForm extends React.Component<{user: IUser}> {
  public render(): JSX.Element[] {
    return [
      <h2>Personal Information</h2>,
    ]
  }
}
