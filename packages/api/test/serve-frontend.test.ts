import conf from '../../shared/lib/conf'

import {IState} from './typedefs'

describe('serve frontend', () => {
  const state: IState = {}

  require('./steps/initialize.test')(state)
  require('./steps/account-setup.test')(state)

  describe('serve frontend', () => {
    let fetchResponse, fetchTextFn: jest.Mock

    beforeEach(() => {
      // @ts-ignore
      global.__lruCache = {}
      conf.stripe.publicKey = '<key>'
      fetchTextFn = jest.fn()
      fetchResponse = {status: 200, text: fetchTextFn}

      __fetch.mockReset()
      __fetch.mockResolvedValue(fetchResponse)
    })

    it('should serve the login page', async () => {
      fetchTextFn.mockResolvedValueOnce('<hash>').mockResolvedValueOnce('<document>')

      const response = await fetch(`${state.baseURL}/login`)
      expect(response.status).toBe(200)
      const text = await response.text()
      expect(text).toEqual('<document>')
      expect(__fetch.mock.calls[1][0]).toContain('<hash>/login.html')
    })

    it('should cache subsequent fetches for same hash', async () => {
      fetchTextFn
        .mockResolvedValueOnce('<hash>')
        .mockResolvedValueOnce('<document>')
        .mockResolvedValueOnce('<hash>')
        .mockRejectedValue(new Error('should have been cached'))

      await fetch(`${state.baseURL}/login`)

      const response = await fetch(`${state.baseURL}/login`)
      expect(response.status).toBe(200)
      const text = await response.text()
      expect(text).toEqual('<document>')
      expect(__fetch).toHaveBeenCalledTimes(3)
    })

    it('should not return from cache for new hash', async () => {
      fetchTextFn
        .mockResolvedValueOnce('<hash>')
        .mockResolvedValueOnce('<document>')
        .mockResolvedValueOnce('<hash1>')
        .mockResolvedValueOnce('NEW')

      await fetch(`${state.baseURL}/login`)

      const response = await fetch(`${state.baseURL}/login`)
      expect(response.status).toBe(200)
      const text = await response.text()
      expect(text).toEqual('NEW')
      expect(__fetch).toHaveBeenCalledTimes(4)
    })

    it('should redirect to login page when no cookies set', async () => {
      fetchTextFn.mockResolvedValueOnce('<hash>').mockResolvedValueOnce('<document>')

      const response = await fetch(state.baseURL)
      expect(response.status).toBe(200)
      const text = await response.text()
      expect(text).toEqual('<document>')
      expect(__fetch.mock.calls[1][0]).toContain('<hash>/login.html')
    })

    it('should serve the app page', async () => {
      fetchTextFn.mockResolvedValueOnce('<hash>').mockResolvedValueOnce('<document>')

      const response = await fetch(state.baseURL, {
        headers: {cookie: `token=${state.token}`},
      })

      expect(response.status).toBe(200)
      const text = await response.text()
      expect(text).toEqual('<document>')
      expect(__fetch.mock.calls[1][0]).toContain('<hash>/index.html')
    })

    it('should serve the account page', async () => {
      fetchTextFn.mockResolvedValueOnce('<hash>').mockResolvedValueOnce('<document>')

      const response = await fetch(`${state.baseURL}/account`, {
        headers: {cookie: `token=${state.token}`},
      })

      expect(response.status).toBe(200)
      const text = await response.text()
      expect(text).toEqual('<document>')
      expect(__fetch.mock.calls[1][0]).toContain('<hash>/account.html')
    })

    it('should inject stripe public key', async () => {
      fetchTextFn.mockResolvedValueOnce('<hash1>').mockResolvedValueOnce('<html><head>')

      const response = await fetch(`${state.baseURL}/account`, {
        headers: {cookie: `token=${state.token}`},
      })

      expect(response.status).toBe(200)
      const text = await response.text()
      expect(text).toMatchSnapshot()
    })
  })

  require('./steps/teardown.test')(state)
})
