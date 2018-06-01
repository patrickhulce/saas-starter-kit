import '../typedefs' // tslint:disable-line
import * as React from 'react'
import {Helmet} from 'react-helmet'
import {IUser} from '../../../shared/lib/typedefs'
import conf from '../../../shared/lib/conf'
import {createRenderFn, findUserOrRedirect, HMR} from '../utils'

let user: IUser

class AccountPage extends React.Component {
  public render(): JSX.Element[] {
    return [
      <Helmet key="head">
        <title>Manage My Account - {conf.displayName}</title>
      </Helmet>,
      <h1 key="header">Hello, {user.firstName}</h1>,
    ]
  }
}

const render = createRenderFn(() => <AccountPage />)

async function init(): Promise<void> {
  user = await findUserOrRedirect()
  render()
}

init() // tslint:disable-line
HMR(module, module => module.hot.accept(render))
