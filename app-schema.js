module.exports = `
  type PasswordCred {
    id: ID!
    email: String!
    verifiedEmail: Boolean!
  }

  type OauthCred {
    id: ID!
    provider: String!
    providerID: String!
    oauthEmail: String
  }

  union AppUserCredential = PasswordCred | OauthCred

  type AppUser {
    id: ID!
    credentials: [AppUserCredential!]!
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

    # How strong must a password be for a user to use it?
    minPasswordStrength: Int

    # Are facebook logins enabled?
    fbLoginEnabled: Boolean
    googleLoginEnabled: Boolean

    oauthRedirectUrl: String
    oauthFailureUrl: String
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

    # How strong must a password be for a user to use it?
    minPasswordStrength: Int

    # Are facebook logins enabled?
    fbLoginEnabled: Boolean
    googleLoginEnabled: Boolean

    oauthRedirectUrl: String
    oauthFailureUrl: String
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

  enum PricePlan {
    BASIC
    PRO
    PREMIUM
  }

  type StripeLineItem {
    description: String!
    quantity: Int!
    amount: Int!
  }

  type StripeInvoice {
    periodStart: Int!
    periodEnd: Int!
    lineItems: [StripeLineItem!]!
    subtotal: Int!
    tax: Int
    total: Int!
  }

  type StripeCustomer {
    id: ID!
    stripeId: ID!
    userId: ID!
    name: String!
    email: String!
    plan: PricePlan!
    upcomingInvoice: StripeInvoice!
  }

  type StripeSetupIntent {
    # same as clientSecret for now.
    id: ID!
    clientSecret: ID!
  }

  type Stripe {
    id: ID! # the userId who is doing the checkout
    setupIntent: StripeSetupIntent!
    customer: StripeCustomer
  }

  type Query {
    apps(userId: ID!): [App]!
    app(appId: ID!): App!
    stripe(userId: ID!): Stripe!
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

    stripeCreateCustomer(
      userId: ID!
      plan: PricePlan!
      paymentMethod: ID!
      email: String!
      name: String!
      paymentConsent: Boolean!
    ): StripeCustomer!
  }
`
