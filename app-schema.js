module.exports = `
  type SiteUser {
    external_id: String!
    email: String!
    first_name: String
    last_name: String
  }

  type Site {
    external_id: String!
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
