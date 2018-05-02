import {Browser, Page} from 'puppeteer'

export interface IState {
  browser: Browser
  page: Page
  rootURL: string
  waitFor: number
}
