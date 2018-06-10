import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import * as React from 'react'
import {Helmet} from 'react-helmet'

import conf from '../../../shared/lib/conf'
import {testIds} from '../utils'

import {LoginForm} from './forms/login'
import {RegisterForm} from './forms/register'
import * as styles from './login.scss'

export interface ILoginPageState {
  selectedTab: number
  errorMessage?: string
}

export class LoginPage extends React.Component<{}, ILoginPageState> {
  public state: ILoginPageState = {selectedTab: 0}

  public render(): JSX.Element {
    const onChange = (evt: any, value: number) => this.setState({selectedTab: value})

    return (
      <React.Fragment>
        <Helmet>
          <title>{conf.displayName} Login</title>
        </Helmet>
        <div className={styles.header}>
          <div className={styles.logo} />
          <h1 className={styles.appName}>{conf.displayName}</h1>
        </div>
        <div className={styles.accountForms}>
          <Tabs
            value={this.state.selectedTab}
            onChange={onChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Login" />
            <Tab data-testid={testIds.createAccountTab} label="Create an Account" />
          </Tabs>
          {this.state.selectedTab === 0 && <LoginForm />}
          {this.state.selectedTab === 1 && <RegisterForm />}
        </div>
      </React.Fragment>
    )
  }
}
