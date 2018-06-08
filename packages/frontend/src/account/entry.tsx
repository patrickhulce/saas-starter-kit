import '../typedefs' // tslint:disable-line
import * as React from 'react'
import {IUser} from '../../../shared/lib/typedefs'
import {createRenderFn, findUserOrRedirect, HMR} from '../utils'
import {AccountPage} from './page'

let user: IUser

const render = createRenderFn(() => <AccountPage user={user} />)

async function init(): Promise<void> {
  user = await findUserOrRedirect()
  render()
}

init() // tslint:disable-line
HMR(module, module => module.hot.accept(render))
