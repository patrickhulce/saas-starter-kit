import {IAuthConfiguration} from 'klay'

import conf from './conf'
import {AuthRole, Permission} from './typedefs'

export const configuration: IAuthConfiguration = {
  secret: conf.secret,
  permissions: {
    [Permission.RootAccess]: [
      Permission.AccountManage,
      Permission.UserPassword,
      Permission.UserProfile,
    ],
    [Permission.AccountManage]: [Permission.AccountView],
    [Permission.AccountView]: [],
    [Permission.UserPassword]: [Permission.UserView],
    [Permission.UserProfile]: [Permission.UserView],
    [Permission.UserView]: [],
  },
  roles: {
    [AuthRole.Root]: [{permission: Permission.RootAccess, criteria: '*'}],
    [AuthRole.Admin]: [
      {permission: Permission.AccountManage, criteria: {id: '<%= accountId %>'}},
      {permission: Permission.UserPassword, criteria: {accountId: '<%= accountId %>'}},
      {permission: Permission.UserProfile, criteria: {accountId: '<%= accountId %>'}},
    ],
    [AuthRole.User]: [
      {permission: Permission.AccountView, criteria: {id: '<%= accountId %>'}},
      {permission: Permission.UserPassword, criteria: {id: '<%= id %>'}},
      {permission: Permission.UserProfile, criteria: {id: '<%= id %>'}},
      {permission: Permission.UserView, criteria: {accountId: '<%= accountId %>'}},
    ],
    [AuthRole.Anonymous]: [],
  },
}
