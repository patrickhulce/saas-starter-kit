global.__sparkpostSend = jest.fn()

module.exports = function() {
  return {transmissions: {send: global.__sparkpostSend}}
}
