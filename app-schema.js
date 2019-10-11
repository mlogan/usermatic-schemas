module.exports = `
  type SiteUser {
    id: String!
    email: String!
    first_name: String
    last_name: String
  }

  type Site {
    id: String!
    host: String!
    users: [SiteUser]!
    secret: String!
  }

  type Query {
    sites(userId: String!): [Site]!
    site(siteId: String!): Site!
  }

  type Mutation {

    createSite(
      userId: String!
      host: String!
    ): Site!

    addSiteUser(
      siteId: String!
      email: String!
      password: String!
    ): SiteUser!
  }
`
