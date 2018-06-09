import * as React from 'react'

import {IUser} from '../../../../shared/lib/typedefs'

export class BillingForm extends React.Component<{user: IUser}> {
  public render(): JSX.Element[] {
    return [
      <h2 key="header">Billing</h2>,
    ]
  }
}
