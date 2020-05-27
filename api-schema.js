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

    recoveryCodesRemaining: Int!

    # A JWT that has been signed with the shared secret key for the
    # app that the user is logged in to. This JWT should be sent to the
    # client site's server, which can verify the JWT to ascertain that
    # the user is logged in to the client site.
    userJwt: String

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
    csrfToken: String!
  }

  type TOTPInfo {
    token: String!
    otpauthUrl: String!
  }

  type Query {
    getAppConfig(appId: ID!): AppConfig!
    getAuthenticatedUser: User
    getTotpKey: TOTPInfo!
  }

  type VerificationPayload {
    redirectUri: String!
    refetch: Query
  }

  type PasswordResetResult {
    redirectUri: String
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

  type LoginPayload {
    user: User!
    refetch: Query
  }

  type SuccessPayload {
    success: Boolean
    refetch: Query
  }

  type RecoveryCodePayload {
    codes: [String!]!
    refetch: Query
  }

  type SessionPayload {
    csrfToken: String!
    refetch: Query
  }

  type PasswordResetPayload {
    redirectUri: String
    refetch: Query
  }

  type ReauthTokenPayload {
    token: String!
    refetch: Query
  }

  type Mutation {
    # This is mutation because a) it modifies client cookies and b)
    # we need serial execution so that it can run before refetch queries.
    # getSessionJWT(appId: ID!): SessionData!
    getSessionJWT(appId: ID!): SessionPayload!

    logout: SuccessPayload

    login(
      credential: LoginCredentialInput!,
      stayLoggedIn: Boolean = false
    ): LoginPayload

    createRecoveryCodes(
      reauthToken: String!,
    ): RecoveryCodePayload

    addTotp(token: String!, code: String!): SuccessPayload
    clearTotp(reauthToken: String!): SuccessPayload

    createAccount(
      email: String!
      password: String!
      loginAfterCreation: Boolean = false
      stayLoggedIn: Boolean = false
    ): LoginPayload

    addPassword(email: String!, password: String!): SuccessPayload

    changePassword(oldPassword: String!, newPassword: String!): SuccessPayload

    verifyEmail(token: String!): VerificationPayload!
    sendVerificationEmail(email: String!): SuccessPayload

    resetPassword(
      token: String!,
      newPassword: String!,
      loginAfterReset: Boolean = false,
      stayLoggedIn: Boolean = false
    ): PasswordResetPayload!

    requestPasswordResetEmail(email: String!): SuccessPayload

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
    signReauthenticationToken(contents: String!, password: String): ReauthTokenPayload
  }
`
