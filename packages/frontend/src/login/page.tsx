import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import * as React from 'react'
import {Helmet} from 'react-helmet'

import conf from '../../../shared/lib/conf'
import * as formStyles from '../components/form/form.scss'
import {testIds} from '../utils'

import {LoginForm} from './forms/login'
import {PasswordResetForm} from './forms/password-reset'
import {RegisterForm} from './forms/register'
import * as styles from './login.scss'

export interface ILoginPageState {
  selectedTab: number
}

export class LoginPage extends React.Component<{}, ILoginPageState> {
  public state: ILoginPageState = {selectedTab: 0}

  private _renderStandardFlow(): React.ReactFragment {
    const onChange = (evt: any, value: number) => this.setState({selectedTab: value})

    return (
      <React.Fragment>
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
        {this.state.selectedTab === 0 && <LoginForm className={formStyles.columnarForm} />}
        {this.state.selectedTab === 1 && <RegisterForm className={formStyles.columnarForm} />}
      </React.Fragment>
    )
  }

  private _renderPasswordResetFlow(): React.ReactFragment {
    return (
      <React.Fragment>
        <PasswordResetForm className={formStyles.columnarForm} />
      </React.Fragment>
    )
  }

  public render(): JSX.Element {
    const isResetPassword = new URLSearchParams(window.location.search).has('reset-password-key')

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
          {isResetPassword ? this._renderPasswordResetFlow() : this._renderStandardFlow()}
        </div>
      </React.Fragment>
    )
  }
}
