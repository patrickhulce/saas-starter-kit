global.fetch = require('isomorphic-fetch')
global.__fetch = jest.fn().mockResolvedValue({status: 200, text: async () => ''})

module.exports = global.__fetch
