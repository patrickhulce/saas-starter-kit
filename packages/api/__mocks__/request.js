global.__requestGet = jest.fn()

module.exports = {
  get: global.__requestGet
}
