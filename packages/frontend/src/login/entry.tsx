import '../typedefs' // tslint:disable-line
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {LoginPage} from './page'

// HACK: let the CSS kick-in before rendering
setTimeout(() => {
  ReactDOM.render(<LoginPage />, document.getElementById('app-root'))
}, 0)

const anyModule = module as any
if (anyModule.hot) {
  anyModule.hot.accept(() => ReactDOM.render(<LoginPage />, document.getElementById('app-root')))
}
