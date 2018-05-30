global.__requestGet = jest.fn().mockReturnValue({pipe: res => res.end()})

module.exports = {
  get: global.__requestGet
}
