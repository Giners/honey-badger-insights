// ESLint config
//
// Although ESLint prefers arrow functions we disable any warnings/errors for not using them as
// Mocha discourages its use as we the Mocha context can't be accessed.For more info see:
// https://mochajs.org/#arrow-functions
/* eslint func-names: 0, prefer-arrow-callback: 0 */
//
// The use of Chai/expect assertions causes ESLint to believe we have a bunch of unused
// expressions (we do I guess). We disable the check for them and use an ESLint check that ignores
// any unused expressions from the use of Chai/expect assertions.
/* eslint no-unused-expressions: 0, chai-friendly/no-unused-expressions: 2 */

// Supporting test libs
import { expect } from 'chai'

// Supporting libs
import express from 'express'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

// Code under test
import apiService from './../../../../src/server/services/apiService'

// Supporting app code
import config from './../../../../src/server/config'

describe('HoneyBadgerApp service test: apiService', function() {
  // Reference to our server we use to test our API service. Needs to be cleaned up when the tests
  // end.
  let testServer = null

  before('Setup test server with GraphQL API service/endpoint', function(done) {
    const app = express()
    app.use(apiService)

    testServer = app.listen(config.app.port, () => {
      expect(testServer).to.not.be.null

      done()
    })
  })

  after('Cleanup test server with GraphQL API service/endpoint', function(
    done,
  ) {
    testServer.close(() => {
      done()
    })
  })

  it('Serves GraphQL requests', function() {
    // Increase the timeout in our unit test as we just use an arbitrary query from our schema
    // ('honeyBadgers') to verify that our API endpoint is setup and serving requests yet
    // unfortunately it takes a while as its communicating with HoneyDB. If we implement a query in
    // the future that doesn't take as long then we can remove this timeout.
    this.timeout(10000)

    const client = new ApolloClient({
      // Always use localhost when running the unit tests as the test server runs, well, locally
      link: new HttpLink({ uri: `http://localhost:${config.app.port}` }),
      cache: new InMemoryCache(),
    })

    return client.query({
      query: gql`
        {
          honeyBadgers {
            ipAddress
          }
        }
      `,
    })
  })
})
