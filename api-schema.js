module.exports = `
  enum CredentialType {
    PASSWORD
    OAUTH
    TOTP
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

  type Name {
    family: String
    given: String
    full: String
  }

  type User {
    id: ID!
    primaryEmail: String!
    name: Name!
    credentials: [UserCredential!]!
  }

  type LoginData {
    # A JWT that has been signed with the shared secret key for the
    # app that the user is logged in to. This JWT should be sent to the
    # client site's server, which can verify the JWT to ascertain that
    # the user is logged in to the client site.
    userJwt: String!

    # Whenever a user logs in, they also automatically get a reauth JWT
    # with userContents = { operations: [] } and the 'login' flag set.
    # reauthenticationMethods will be set to indicate how they logged in.
    # This field is not present when the user has been authenticated via
    # an auth cookie - that is, we only populate this if they actually
    # presented credentials
    reauthToken: String
  }

  type AppConfig {
    minPasswordStrength: Int

    totpEnabled: Boolean!

    fbLoginEnabled: Boolean!
    fbLoginUrl: String!
    googleLoginEnabled: Boolean!
    googleLoginUrl: String!
    githubLoginEnabled: Boolean!
    githubLoginUrl: String!
  }

  type SessionData {
    auth: LoginData
    csrfToken: String!
    config: AppConfig!
  }

  type TOTPInfo {
    token: String!
    otpauthUrl: String!
  }

  type Query {
    getSessionJWT(appId: ID!): SessionData!
    getAuthenticatedUser: User!

    getTotpKey: TOTPInfo!
    getRecoveryCodesCount: Int!
  }

  type VerificationResult {
    redirectUri: String!
  }

  type PasswordResetResult {
    redirectUri: String
  }

  type RecoveryCodes {
    codes: [String!]!
  }

  input PasswordInput {
    email: String!
    password: String!
  }

  input LoginCredentialInput {
    # only one of password/oauthToken should be present.
    password: PasswordInput
    oauthToken: String

    # totpCode is optional, for 2FA logins.
    totpCode: String
  }

  type Mutation {
    logout: Boolean

    login(
      credential: LoginCredentialInput!,
      stayLoggedIn: Boolean = false
    ): LoginData

    createRecoveryCodes(
      reauthToken: String!,
    ): RecoveryCodes

    addTotp(token: String!, code: String!): Boolean
    clearTotp(reauthToken: String!): Boolean

    createAccount(
      email: String!
      password: String!
      loginAfterCreation: Boolean = false
      stayLoggedIn: Boolean = false
    ): LoginData

    addPassword(email: String!, password: String!): Boolean

    changePassword(oldPassword: String!, newPassword: String!): Boolean

    verifyEmail(token: String!): VerificationResult!
    sendVerificationEmail(email: String!): Boolean

    resetPassword(
      token: String!,
      newPassword: String!,
      loginAfterReset: Boolean = false,
      stayLoggedIn: Boolean = false
    ): PasswordResetResult!

    requestPasswordResetEmail(email: String!): Boolean

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
    #    { id: string, login: boolean, userContents: string,
    #      reauthenticationMethods: string[] }
    #
    # where:
    #   'id' is the id of the successfully authenticated user,
    #   'login' indicates that the token was populated by loginPassword or loginOauth
    #   'userContents' is the string provided in the contents argument, and
    #   'reauthenticationMethods' is a list of the authentication methods that
    #     were supplied to signToken (e.g. 'password').
    #
    # The signing key is the application's secret key.
    signReauthenticationToken(contents: String!, password: String): String!
  }
`
