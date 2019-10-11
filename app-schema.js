module.exports = `
  type SiteUser {
    id: ID!
    email: String!
    first_name: String
    last_name: String
  }

  type Site {
    id: ID!
    host: String!
    users: [SiteUser]!
    secret: String!
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
  }
`
