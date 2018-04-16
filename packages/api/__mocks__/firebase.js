module.exports = {
  auth() {
    return {
      signInWithEmailAndPassword() {
        return global.__firebaseSignInMock(arguments)
      }
    }
  }
}
