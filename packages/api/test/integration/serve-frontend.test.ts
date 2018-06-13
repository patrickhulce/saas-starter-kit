import {IState} from '../typedefs'

module.exports = (state: IState) => {
  describe('serve frontend', () => {
    let requestApi, requestPipeFn, fetchResponse, fetchTextFn

    beforeEach(() => {
      fetchTextFn = jest.fn().mockResolvedValue('<hash>')
      fetchResponse = {status: 200, text: fetchTextFn}
      requestPipeFn = jest.fn().mockImplementation(res => res.end('<document>'))
      requestApi = {pipe: requestPipeFn}

      __fetch.mockReset()
      __fetch.mockResolvedValue(fetchResponse)
      __requestGet.mockReset()
      __requestGet.mockReturnValue(requestApi)
    })

    it('should serve the login page', async () => {
      const response = await fetch(`${state.baseURL}/login`)
      expect(response.status).toBe(200)
      const text = await response.text()
      expect(text).toEqual('<document>')
      expect(__requestGet.mock.calls[0][0]).toContain('<hash>/login.html')
    })

    it('should redirect to login page when no cookies set', async () => {
      const response = await fetch(state.baseURL)
      expect(response.status).toBe(200)
      const text = await response.text()
      expect(text).toEqual('<document>')
      expect(__requestGet.mock.calls[0][0]).toContain('<hash>/login.html')
    })

    it('should serve the app page', async () => {
      const response = await fetch(state.baseURL, {
        headers: {cookie: `token=${state.token}`},
      })

      expect(response.status).toBe(200)
      const text = await response.text()
      expect(text).toEqual('<document>')
      expect(__requestGet.mock.calls[0][0]).toContain('<hash>/index.html')
    })

    it('should serve the account page', async () => {
      const response = await fetch(`${state.baseURL}/account`, {
        headers: {cookie: `token=${state.token}`},
      })

      expect(response.status).toBe(200)
      const text = await response.text()
      expect(text).toEqual('<document>')
      expect(__requestGet.mock.calls[0][0]).toContain('<hash>/account.html')
    })
  })
}
