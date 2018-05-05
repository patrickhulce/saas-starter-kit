import {Browser, Page} from 'puppeteer'

export interface IState {
  browser: Browser
  page: Page
  rootURL: string
  waitFor: number
  user?: {password: string}
  userMailbox?: IMailbox
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
