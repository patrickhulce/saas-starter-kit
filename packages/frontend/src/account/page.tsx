import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import LockIcon from '@material-ui/icons/Lock'
import PersonIcon from '@material-ui/icons/Person'
import * as React from 'react'
import {Helmet} from 'react-helmet'

import conf from '../../../shared/lib/conf'
import {IUser} from '../../../shared/lib/typedefs'

import * as styles from './account.scss'
import {BillingForm} from './forms/billing'
import {PasswordForm} from './forms/password'
import {ProfileForm} from './forms/profile'

export interface IPageProps {
  user: IUser
}

export enum FormType {
  Profile = 'Profile',
  Password = 'Password',
  Billing = 'Billing',
}

export interface IPageState {
  activeForm: FormType
}

const forms = [
  {id: FormType.Profile, Icon: PersonIcon, Form: ProfileForm},
  {id: FormType.Password, Icon: LockIcon, Form: PasswordForm},
  {id: FormType.Billing, Icon: AttachMoneyIcon, Form: BillingForm},
]

export class AccountPage extends React.Component<IPageProps, IPageState> {
  public state: IPageState = {activeForm: FormType.Profile}

  private _renderFormNavItems(): JSX.Element[] {
    return forms.map(({id, Icon}) => {
      const classes = id === this.state.activeForm ? styles.active : ''
      const onClick = () => this.setState({activeForm: id})
      return (
        <ListItem key={id} button className={classes} onClick={onClick}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={id} />
        </ListItem>
      )
    })
  }

  private _renderActiveContent(): JSX.Element {
    const {Form} = forms.find(form => this.state.activeForm === form.id)!
    return <Form user={this.props.user} />
  }

  public render(): JSX.Element {
    return (
      <React.Fragment>
        <Helmet>
          <title>Account Settings - {conf.displayName}</title>
        </Helmet>
        <Paper className={styles.accountForms}>
          <List component="nav" className={styles.sidenav}>
            {this._renderFormNavItems()}
          </List>
          <div className={styles.primaryContent}>{this._renderActiveContent()}</div>
        </Paper>
      </React.Fragment>
    )
  }
}
