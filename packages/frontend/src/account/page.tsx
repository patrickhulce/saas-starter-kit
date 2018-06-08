import * as styles from './account.scss'
import * as React from 'react'
import {Helmet} from 'react-helmet'
import conf from '../../../shared/lib/conf'
import {IUser} from '../../../shared/lib/typedefs'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import LockIcon from '@material-ui/icons/Lock'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'

export interface IPageProps {
  user: IUser
}

export enum FormType {
  Personal = 'Personal',
  Password = 'Password',
  Billing = 'Billing',
}

export interface IPageState {
  activeForm: FormType
}

export class AccountPage extends React.Component<IPageProps, IPageState> {
  public state: IPageState = {activeForm: FormType.Personal}

  private _formNavItem(icon: JSX.Element, type: FormType): JSX.Element {
    const classes = type === this.state.activeForm ? styles.active : ''
    return (
      <ListItem button className={classes}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={type} />
      </ListItem>
    )
  }

  public render(): JSX.Element[] {
    return [
      <Helmet key="head">
        <title>Account Settings - {conf.displayName}</title>
      </Helmet>,
      <Paper key="form" className={styles.accountForms}>
        <List component="nav" className={styles.sidenav}>
          {this._formNavItem(<PersonIcon />, FormType.Personal)}
          {this._formNavItem(<LockIcon />, FormType.Password)}
          {this._formNavItem(<AttachMoneyIcon />, FormType.Billing)}
        </List>
        <div className={styles.primaryContent}>
        <h2>Personal Information</h2>
        </div>
      </Paper>,
    ]
  }
}
