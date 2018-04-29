import 'isomorphic-fetch'

import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'

import TopHoneyBadgerType from './types'
import config from './../config'

/** The URL for the HoneyDB API that returns a list of bad hosts from the last 24 hours */
const honeyDBBadHostsAPIURL = 'https://riskdiscovery.com/honeydb/api/bad-hosts'

/** HoneyDB auth header for accessing its APIs that identifies who is accessing the API */
const honeyDBAPIAuthIDHeader = 'X-HoneyDb-ApiId'

/** HoneyDB auth header for accessing its APIs that verifies who is accessing the API */
const honeyDBAPIAuthKeyHeader = 'X-HoneyDb-ApiKey'

/** Used to limit how much data (honey badgers) we ultimately return */
const maxHoneyDBDatums = 100

/**
 * The entry point into our graph of relationships between types we define. You can read this as:
 * "You can ask me, the root query, about honey badgers in the application." The most important part
 * of the query is the 'resolve()' functions on the fields which is used to actually return data on
 * the defined types.
 */
const rootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    topHoneyBadgers: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(TopHoneyBadgerType)),
      ),
      resolve() {
        const { id, key } = config.serviceCreds.honeyDB

        return fetch(honeyDBBadHostsAPIURL, {
          headers: {
            [honeyDBAPIAuthIDHeader]: id,
            [honeyDBAPIAuthKeyHeader]: key,
          },
        })
          .then(res => res.json())
          .then(honeyDBData => {
            let honeyBadgers = honeyDBData

            // Control how much data we return to our consumers. We are presuming (which is bad - but
            // for the sake of simplicity) that the data returned to us from HoneyDB is in sorted
            // order with the most frequently seen bad host/IP indexed at the beginning of the array.
            // As a result of this assumption we will end up returning the top honey badgers to our
            // consumers.
            if (honeyBadgers.length > maxHoneyDBDatums) {
              honeyBadgers = honeyBadgers.slice(0, maxHoneyDBDatums)
            }

            // Map the data returned by HoneyDB to return an object defined by our GraphQL schema.
            // Disable the ESLint error 'camelcase' as HoneyDB returns the data with underscores in
            // the datas identifiers
            // eslint-disable-next-line camelcase
            honeyBadgers = honeyBadgers.map(({ remote_host, count }) => ({
              ipAddress: remote_host,
              count,
            }))

            return honeyBadgers
          })
      },
      description: `Gets the top ${maxHoneyDBDatums} honey badgers from the last 24 hours based on how many times they have been seen`,
    },
  },
  description: 'The GraphQL queries available in the app',
})

/** The instance of our GraphQL schema that can be used in our app */
const schema = new GraphQLSchema({
  query: rootQueryType,
})

export default schema
