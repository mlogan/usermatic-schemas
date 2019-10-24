module.exports = `
  type SiteUser {
    id: ID!
    email: String!
    verified_email: Boolean
    first_name: String
    last_name: String
  }

  input SiteConfigInput {
    verifyEmail: Boolean
    requireVerification: Boolean
  }

  type SiteConfig {
    # Send verification email?
    verifyEmail: Boolean
    # Require email verification before login
    requireVerification: Boolean
  }

  type Site {
    id: ID!
    host: String!
    users: [SiteUser]!
    secret: String!
    config: SiteConfig!
  }

  type Query {
    sites(userId: ID!): [Site]!
    site(siteId: ID!): Site!
  }

  type Mutation {

    createSite(
      userId: ID!
      host: String!
    ): Site!

    addSiteUser(
      siteId: ID!
      email: String!
      password: String!
    ): SiteUser!

    setSiteConfig(
      siteId: ID!
      config: SiteConfigInput!
    ): SiteConfig!
  }
`
