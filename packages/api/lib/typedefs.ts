import 'express' // tslint:disable-line

declare module 'express-serve-static-core' {
  /* tslint:disable */
  export interface Response {
    body?: any
  }
  /* tslint:enable */
}

export {}
