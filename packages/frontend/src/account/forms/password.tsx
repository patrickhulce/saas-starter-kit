import * as React from 'react'

import {IUser} from '../../../../shared/lib/typedefs'

export class PasswordForm extends React.Component<{user: IUser}> {
  public render(): JSX.Element[] {
    return [
      <h2 key="password">Password</h2>,
    ]
  }
}
