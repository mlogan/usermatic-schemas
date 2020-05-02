module.exports = `
  enum CredentialType {
    PASSWORD
    OAUTH
  }

  # maybe make this into a union
  type UserCredential {
    id: ID!
    type: CredentialType!
    email: String
    emailIsVerified: Boolean

    # e.g. facebook, google
    provider: String
    providerID: String
    photoURL: String
  }

  type SvcUser {
    id: ID!
    primaryEmail: String!
    firstName: String
    lastName: String
    credentials: [UserCredential!]!
  }

  type SvcAuthToken {
    # A JWT that has been signed with the shared secret key for the
    # app that the user is logged in to. This JWT should be sent to the
    # client site's server, which can verify the JWT to ascertain that
    # the user is logged in to the client site.
    userJwt: String!
  }

  type AppConfig {
    minPasswordStrength: Int

    fbLoginEnabled: Boolean!
    fbLoginUrl: String!
    googleLoginEnabled: Boolean!
    googleLoginUrl: String!
    githubLoginEnabled: Boolean!
    githubLoginUrl: String!
  }

  type SvcSessionData {
    auth: SvcAuthToken
    csrfToken: String!
    config: AppConfig
  }

  type Query {
    svcGetSessionJWT(appId: ID!): SvcSessionData
    svcGetAuthenticatedUser: SvcUser!
  }

  type VerificationResult {
    redirectUri: String!
  }

  type PasswordResetResult {
    redirectUri: String
  }

  type Mutation {
    logout: Boolean
    loginPassword(email: String!, password: String!, stayLoggedIn: Boolean = false): SvcAuthToken!

    loginOauth(oauthToken: String!, stayLoggedIn: Boolean = false): SvcAuthToken!

    svcCreateAccount(
      email: String!
      password: String!
      loginAfterCreation: Boolean = false
      stayLoggedIn: Boolean = false
    ): SvcAuthToken

    addPassword(email: String!, password: String!): Boolean

    svcChangePassword(oldPassword: String!, newPassword: String!): Boolean

    svcVerifyEmail(token: String!): VerificationResult!
    svcSendVerificationEmail(email: String!): Boolean

    svcResetPassword(token: String!, newPassword: String!): PasswordResetResult!
    svcRequestPasswordResetEmail(email: String!): Boolean

    # Request that the server sign a token provided by the client.
    # Used for forcing re-authentication before sensitive operations. e.g.
    # the client application may require that the user re-authenticates before
    # deleting some object. The client can then prompt for the password, and
    # call
    #
    #    signToken("{ deleteObject: 123abc }", "hunter2")
    #
    # Usermatic signs the provided string, and returns it to the client. The
    # client can now send it to their backend as part of the deletion request,
    # which proves to their application backend that the user re-authenticated.
    #
    # The response is a signed token with the contents:
    #    { id: string, userContents: string, reauthenticationMethods: string[] }
    #
    # where:
    #   'id' is the id of the successfully authenticated user,
    #   'userContents' is the string provided in the contents argument, and
    #   'reauthenticationMethods' is a list of the authentication methods that
    #     were supplied to signToken (e.g. 'password').
    #
    # The signing key is the application's secret key.
    signReauthenticationToken(contents: String!, password: String): String!
  }
`
