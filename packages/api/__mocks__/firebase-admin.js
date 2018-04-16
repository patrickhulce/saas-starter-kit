module.exports = {
  auth() {
    return {
      createUser() {
        return global.__firebaseCreateUserMock(arguments)
      },
      getUserByEmail() {
        return global.__firebaseGetUserByEmailMock(arguments)
      },
      verifyIdToken() {
        return global.__firebaseVerifyTokenMock(arguments)
      }
    }
  }
}
