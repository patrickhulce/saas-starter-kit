global.fetch = require('isomorphic-fetch')
global.__fetch = jest.fn()

module.exports = global.__fetch
