import * as styles from './login.scss'
import * as React from 'react'
import {Helmet} from 'react-helmet'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import {LoginForm} from './forms/login'
import {RegisterForm} from './forms/register'
import conf from '../../../shared/lib/conf'

export interface ILoginPageState {
  selectedTab: number
  errorMessage?: string
}

export class LoginPage extends React.Component<{}, ILoginPageState> {
  public state: ILoginPageState = {selectedTab: 0}

  public render(): JSX.Element[] {
    const onChange = (evt: any, value: number) => this.setState({selectedTab: value})

    return [
      <Helmet key="head">
        <title>{conf.displayName} Login</title>
      </Helmet>,
      <div key="header" className={styles.header}>
        <div className={styles.logo}></div>
        <h1 className={styles.appName}>{conf.displayName}</h1>
      </div>,
      <div key="form" className={styles.accountForms}>
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
