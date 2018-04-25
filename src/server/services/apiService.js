import expressGraphQL from 'express-graphql'

import schema from './../graphql/schema'

/** API service that exposes our GraphQL schema. Meant to be consumed as ExpressJS middleware. */
const apiService = expressGraphQL({ schema })

export default apiService
