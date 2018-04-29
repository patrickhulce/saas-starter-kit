import {ISQLOptions} from 'klay'

export enum ModelID {
  Account = 'account',
  User = 'user',
}

export interface IAccount {
  id?: number
  name: string
  plan: AccountPlan
  createdAt?: Date
  updatedAt?: Date
}

export interface IUser {
  id?: number
  accountId: number
  role: AuthRole
  email: string
  password: string
  firstName: string
  lastName: string
  createdAt?: Date
  updatedAt?: Date
}

export enum AuthRole {
  Root = 'root',
  Admin = 'admin',
  User = 'user',
  Anonymous = 'anonymous',
}

export enum Permission {
  AccountManage = 'account:manage',
  AccountView = 'account:view',
  UserManage = 'user:manage',
  UserView = 'user:view',
}

export enum AccountPlan {
  Free = 'free',
  Bronze = 'bronze',
  Silver = 'silver',
  Gold = 'gold',
}

export enum JsEnvironment {
  Browser = 'browser',
  Server = 'server',
}

export interface IConf {
  debug: boolean
  production: boolean
  isUnderTest: boolean

  domain: string
  displayName: string
  apiPathPrefix: string

  secret: string
  jsEnvironment: JsEnvironment
  database: ISQLOptions
  sparkpost: {fromAddress: string; apiKey: string; sendToSink: boolean}
}
