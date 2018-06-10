import * as React from 'react'

import {IUser} from '../../../../shared/lib/typedefs'

export class PasswordForm extends React.Component<{user: IUser}> {
  public render(): JSX.Element {
    return (
      <React.Fragment>
        <h2>Password</h2>
      </React.Fragment>
    )
  }
}
