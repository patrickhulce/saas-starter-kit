global.__lruCache = {}

module.exports = function() {
  return {
    get: k => global.__lruCache[k],
    set: (k, v) => (global.__lruCache[k] = v),
  }
}
