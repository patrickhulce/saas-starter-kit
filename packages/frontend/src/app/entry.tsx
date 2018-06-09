import * as React from 'react'
import {Helmet} from 'react-helmet'

import conf from '../../../shared/lib/conf'
import {IUser} from '../../../shared/lib/typedefs'
import '../typedefs' // tslint:disable-line
import {HMR, createRenderFn, findUserOrRedirect} from '../utils'

let user: IUser

class Application extends React.Component {
  public render(): JSX.Element[] {
    return [
      <Helmet key="head">
        <title>{conf.displayName}</title>
      </Helmet>,
      <h1 key="header">Hello, {user.firstName}</h1>,
    ]
  }
}

const render = createRenderFn(() => <Application />)

async function init(): Promise<void> {
  user = await findUserOrRedirect()
  render()
}

init() // tslint:disable-line
HMR(module, module => module.hot.accept(render))
