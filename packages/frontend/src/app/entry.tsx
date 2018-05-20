import '../typedefs' // tslint:disable-line
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Helmet} from 'react-helmet'
import {IUser} from '../../../shared/lib/typedefs'
import conf from '../../../shared/lib/conf'

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

function redirectToLogin(): void {
  window.location.href = '/login'
}

function render(): void {
  ReactDOM.render(<Application />, document.getElementById('app-root'))
}

async function init(): Promise<void> {
  try {
    user = JSON.parse(localStorage.getItem('loggedInUser') || '')
    const response = await fetch('/api/v1/users/me', {credentials: 'same-origin'})
    if (response.status !== 200) throw new Error('Unauthorized')
    setTimeout(render, 0)
  } catch (err) {
    console.error(err) // tslint:disable-line
    redirectToLogin()
  }
}

const anyModule = module as any
if (anyModule.hot) {
  anyModule.hot.accept(render)
}

init() // tslint:disable-line
