import {ISQLOptions} from 'klay'

export enum ModelID {
  Account = 'account',
  User = 'user',
  Verification = 'verification',
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
  createdAt?: Date
  updatedAt?: Date
}

export type IUser = Required<IUserInput>

export interface IVerificationMeta {
  ip?: string
}

export interface IVerificationInput {
  id?: number
  userId: number
  key?: string
  type: VerificationType
  consumed: boolean
  meta: IVerificationMeta
  createdAt?: Date
  updatedAt?: Date
}

export type IVerification = Required<IVerificationInput>

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

export enum VerificationType {
  Email = 'email',
  ResetPassword = 'reset-password',
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
