import * as React from 'react'

import {IUser} from '../../../shared/lib/typedefs'
import '../typedefs' // tslint:disable-line
import {HMR, createRenderFn, findUserOnStartupOrBail} from '../utils'

let user: IUser

const render = createRenderFn(() => {
  // tslint:disable-next-line
  const AccountPage = require('./page').AccountPage
  return <AccountPage user={user} />
})

async function init(): Promise<void> {
  user = await findUserOnStartupOrBail()
  render()
}

init() // tslint:disable-line
HMR(module, module => module.hot.accept(render))
