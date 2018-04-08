import {IAuthConfiguration} from 'klay'
import conf from './conf'
import {AuthRole, Permission} from './typedefs'

export const configuration: IAuthConfiguration = {
  secret: conf.secret,
  permissions: {
    [Permission.AccountManage]: [Permission.AccountView],
    [Permission.AccountView]: [],
    [Permission.UserManage]: [Permission.UserView],
    [Permission.UserView]: [],
  },
  roles: {
    [AuthRole.Root]: [
      {permission: Permission.AccountManage, criteria: '*'},
      {permission: Permission.UserManage, criteria: '*'},
    ],
    [AuthRole.Admin]: [
      {permission: Permission.AccountManage, criteria: 'id=<%= accountId %>'},
      {permission: Permission.UserManage, criteria: 'accountId=<%= accountId %>'},
    ],
    [AuthRole.User]: [
      {permission: Permission.AccountView, criteria: 'id=<%= accountId %>'},
      {permission: Permission.UserManage, criteria: 'id=<%= id %>'},
      {permission: Permission.UserView, criteria: 'accountId=<%= accountId %>'},
    ],
    [AuthRole.Anonymous]: [],
  },
}
