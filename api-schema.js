module.exports = `
  type SvcUser {
    id: ID!
    email: String!
    emailIsVerified: Boolean!
  }

  type SvcAuthToken {
    # A JWT that has been signed with the shared secret key for the
    # site that the user is logged in to. This JWT should be sent to the
    # client site's server, which can verify the JWT to ascertain that
    # the user is logged in to the client site.
    userJwt: String!
  }

  type SvcSessionData {
    auth: SvcAuthToken
    csrfToken: String!
  }

  type Query {
    svcGetSessionJWT(siteId: ID!): SvcSessionData
    svcGetAuthenticatedUser: SvcUser!
  }

  type VerificationResult {
    redirectUri: String!
  }

  type Mutation {
    svcLogout: Boolean
    svcLogin(email: String!, password: String!, stayLoggedIn: Boolean = false): SvcAuthToken!

    svcCreateAccount(
      email: String!
      password: String!
      loginAfterCreation: Boolean = false
      stayLoggedIn: Boolean = false
    ): SvcAuthToken

    svcVerifyEmail(token: String!): VerificationResult
    svcSendVerificationEmail: Boolean
  }
`
