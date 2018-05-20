import * as React from 'react'
import {Helmet} from 'react-helmet'
import Tabs, {Tab} from 'material-ui/Tabs'
import {LoginForm} from './login'
import {RegisterForm} from './register'
import conf from '../../../shared/lib/conf'

export interface ILoginPageState {
  selectedTab: number
  errorMessage?: string
}

export class LoginPage extends React.Component<{}, ILoginPageState> {
  public state: ILoginPageState = {selectedTab: 0}

  public render(): JSX.Element[] {
    const onChange = (evt, value) => this.setState({selectedTab: value})

    return [
      <Helmet key="head">
        <title>{conf.displayName} Login</title>
      </Helmet>,
      <h1 key="header" className="app-name">{conf.displayName}</h1>,
      <div key="form" className="account-forms">
        <Tabs
          value={this.state.selectedTab}
          onChange={onChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label="Login" />
          <Tab data-testid="create-account-tab" label="Create an Account" />
        </Tabs>
        {this.state.selectedTab === 0 && <LoginForm />}
        {this.state.selectedTab === 1 && <RegisterForm />}
      </div>,
    ]
  }
}
