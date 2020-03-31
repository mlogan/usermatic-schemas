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

    svcChangePassword(oldPassword: String!, newPassword: String!): Boolean

    svcVerifyEmail(token: String!): VerificationResult!
    svcSendVerificationEmail: Boolean

    svcResetPassword(token: String!, newPassword: String!): PasswordResetResult!
    svcRequestPasswordResetEmail(email: String!): Boolean
  }
`
