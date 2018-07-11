import {Browser, Page} from 'puppeteer'

export interface IState {
  browser?: Browser
  page?: Page
  rootURL?: string
  waitFor?: number
  mail?: IMailService
  login?: {email: string; password: string}
  userMailbox?: IMailbox
  emailVerificationLink?: string
}

export interface IMailbox {
  id: string
  address: string
}

export interface IMessage {
  to: string[]
  from: string
  subject: string
  body: string
}

export interface IMailService {
  createInbox(): Promise<IMailbox>
  readMail(inbox: IMailbox, waitFor?: number): Promise<IMessage[]>
}
