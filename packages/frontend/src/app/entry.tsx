import * as React from 'react'
import {Helmet} from 'react-helmet'

import conf from '../../../shared/lib/conf'
import {IUser} from '../../../shared/lib/typedefs'
import '../typedefs' // tslint:disable-line
import {HMR, createRenderFn, findUserOrRedirect} from '../utils'

let user: IUser

class Application extends React.Component {
  public render(): JSX.Element {
    return (
      <React.Fragment>
        <Helmet>
          <title>{conf.displayName}</title>
        </Helmet>
        <h1>Hello, {user.firstName}</h1>
      </React.Fragment>
    )
  }
}

const render = createRenderFn(() => <Application />)

async function init(): Promise<void> {
  user = await findUserOrRedirect()
  render()
}

init() // tslint:disable-line
HMR(module, module => module.hot.accept(render))
