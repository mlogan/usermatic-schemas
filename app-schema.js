module.exports = `
  type AppUser {
    id: ID!
    email: String!
    verified_email: Boolean
    first_name: String
    last_name: String
  }

  input HostInput {
    hostname: String!
  }

  input AppConfigInput {
    verifyEmail: Boolean
    requireVerification: Boolean

    # where verification emails should link to
    verificationTargetUri: String
    # where to redirect the user after clicking a verification email.
    verificationRedirectUri: String

    # where password reset emails should link to
    resetPasswordUri: String
    # where to redirect the user after resetting their password
    resetPasswordRedirectUri: String
  }

  type AppConfig {
    # Send verification email?
    verifyEmail: Boolean
    # Require email verification before login
    requireVerification: Boolean

    # where verification emails should link to
    verificationTargetUri: String
    # where to redirect the user after clicking a verification email.
    verificationRedirectUri: String

    # where password reset emails should link to
    resetPasswordUri: String
    # where to redirect the user after resetting their password
    resetPasswordRedirectUri: String
  }

  type AppHost {
    id: ID!
    hostname: String!
  }

  type App {
    id: ID!
    name: String!
    users (count: Int, offset: Int): [AppUser]!
    secret: String!
    config: AppConfig!
    hosts: [AppHost]!
  }

  type Query {
    apps(userId: ID!): [App]!
    app(appId: ID!): App!
  }

  type Mutation {

    createApp(
      userId: ID!
      name: String!
      hosts: [HostInput]!
    ): App!

    deleteApp(appId: ID!): Boolean!

    addHost(appId: ID!, host: String!): AppHost!

    removeHost(appId: ID!, hostId: ID!): Boolean!

    addAppUser(
      appId: ID!
      email: String!
      password: String!
    ): AppUser!

    deleteAppUser(
      userId: ID!
    ): Boolean!

    setAppConfig(
      appId: ID!
      config: AppConfigInput!
    ): AppConfig!
  }
`
