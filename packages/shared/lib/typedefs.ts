import {ISQLOptions} from 'klay'

export enum ModelID {
  Account = 'account',
  User = 'user',
}

export interface IAccountInput {
  id?: number
  name: string
  plan: AccountPlan
  createdAt?: Date
  updatedAt?: Date
}

export type IAccount = Required<IAccountInput>

export interface IUserInput {
  id?: number
  accountId: number
  role: AuthRole
  email: string
  password: string
  firstName: string
  lastName: string
  isVerified: boolean
  verificationKey?: string
  createdAt?: Date
  updatedAt?: Date
}

export type IUser = Required<IUserInput>

export enum AuthRole {
  Root = 'root',
  Admin = 'admin',
  User = 'user',
  Anonymous = 'anonymous',
}

export enum Permission {
  RootAccess = '_root_',
  AccountManage = 'account:manage',
  AccountView = 'account:view',
  UserPassword = 'user:password',
  UserProfile = 'user:profile',
  UserView = 'user:view',
}

export enum AccountPlan {
  Free = 'free',
  Bronze = 'bronze',
  Silver = 'silver',
  Gold = 'gold',
}

export interface IConf {
  debug: boolean
  production: boolean
  isUnderTest: boolean

  origin: string
  cdnAppURL: string
  termsOfServiceURL: string
  displayName: string

  secret: string
  database: ISQLOptions

  mailslurp: {apiKey: string}
  sparkpost: {fromAddress: string; apiKey: string; sendToTestMailboxOnly: boolean}
}
