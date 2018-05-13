import '../typedefs' // tslint:disable-line
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Tabs, {Tab} from 'material-ui/Tabs'
import {LoginForm} from './login'
import {RegisterForm} from './register'

export interface ILoginPageState {
  selectedTab: number
  errorMessage?: string
}

export class LoginPage extends React.Component<{}, ILoginPageState> {
  public state: ILoginPageState = {selectedTab: 0}

  public render(): JSX.Element[] {
    const onChange = (evt, value) => this.setState({selectedTab: value})

    return [
      <h1 key="header" className="app-name">THE_PRODUCT_DISPLAY_NAME</h1>,
      <div key="form" className="account-forms">
        <Tabs
          value={this.state.selectedTab}
          onChange={onChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label="Login" />
          <Tab className="atmn-create-account" label="Create an Account" />
        </Tabs>
        {this.state.selectedTab === 0 && <LoginForm />}
        {this.state.selectedTab === 1 && <RegisterForm />}
      </div>,
    ]
  }
}

// HACK: let the CSS kick-in before rendering
setTimeout(() => {
  ReactDOM.render(<LoginPage />, document.getElementById('app-root'))
}, 0)

const anyModule = module as any
if (anyModule.hot) {
  anyModule.hot.accept(() => ReactDOM.render(<LoginPage />, document.getElementById('app-root')))
}
