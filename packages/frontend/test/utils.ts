// tslint:disable

export interface IFetchMockInput {
  status?: number
  body?: string
  err?: Error
}

export interface IFetchMock {
  fn(): Promise<{status?: number; json: () => Promise<any>}>
  resolve(): void
  reject(err?: Error): void
}

export function createFetchMock(input: IFetchMockInput = {}): IFetchMock {
  const fetchMock: IFetchMock = {
    fn: async () => ({} as any),
    resolve: () => {},
    reject: () => {},
  }

  fetchMock.fn = () =>
    new Promise((r1, r2) => {
      fetchMock.resolve = () => r1({status: input.status, json: async () => input.body})
      fetchMock.reject = (err?: Error) => r2(err || input.err)
    })

  return fetchMock
}
