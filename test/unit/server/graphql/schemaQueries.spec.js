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
//
// We disable the errors about the rule about underscore dangles as the GraphQL response when we
// query for the schema/query types contains data members with underscores as part of their
// identifiers.
/* eslint no-underscore-dangle: 0 */

// General 3rd-party supporting test libs
import { expect } from 'chai'

// General 3rd-party supporting libs
import { graphql } from 'graphql'
import 'isomorphic-fetch'

// Our GraphQL schema that is under test
import schema from './../../../../src/server/graphql/schema'

describe('Schema query tests:', function() {
  // How many queries we expect in our schema. This is used to simply ensure that we update these
  // tests after adding/removing a query from our schema.
  const expectedSchemaQueries = 4

  // This test is simply to help us remembr to test all of our queries. It will fail once you
  // have added a new field to the root query. After adding a test for the root query please
  // update this test to reflect that you have tested all of the queries.
  it('We have tested all of our queries:', async function() {
    const query = `
      {
        __schema {
          queryType {
            name
            fields {
              name
            }
          }
        }
      }
    `

    const result = await graphql(schema, query)

    expect(result).to.exist
    expect(result.errors).to.be.undefined
    expect(result.data).to.exist

    const { __schema } = result.data

    expect(__schema).to.exist
    expect(__schema.queryType).to.exist
    expect(__schema.queryType.name).to.equal('RootQuery')

    // Update how the expected length count of our root query after you have added tests for the
    // new queries you have added
    expect(__schema.queryType.fields).to.exist
    expect(
      __schema.queryType.fields.length,
      'Found additional query fields - Update after writing tests for the queries you added',
    ).to.equal(expectedSchemaQueries)
  })

  describe('Query: topHoneyBadgers', function() {
    const query = `
      {
        topHoneyBadgers {
          ipAddress
          count
        }
      }
    `

    // Helper method to perform common basic validation on the 'topHoneyBadgers' query. Ought to be
    // invoked before more specific validation is done on the 'topHoneyBadgers' query.
    const validateTopHoneyBadgersQuery = result => {
      expect(
        result.errors,
        `Didn't expect any errors but got: ${result.errors}`,
      ).to.be.undefined
      expect(result.data).to.exist
      expect(result.data.topHoneyBadgers).to.exist
    }

    it('Query can successfully be executed', async function() {
      // Increase the timeout in our unit test as our schema makes async calls to HoneyDB
      this.timeout(15000)

      const result = await graphql(schema, query)

      validateTopHoneyBadgersQuery(result)
    })

    it('Query returns at most 25 honey badgers', async function() {
      // Increase the timeout in our unit test as our schema makes async calls to HoneyDB
      this.timeout(15000)

      const result = await graphql(schema, query)

      validateTopHoneyBadgersQuery(result)

      // At most the 'topHoneyBadgers' query will return 25 entries
      expect(result.data.topHoneyBadgers.length).to.be.at.most(25)
    })
  })

  describe('Query: autonomousSystems', function() {
    // Query that can be used to get the list of top honey badgers. Meant to get IP addresses so
    // they can be supplied to the arguments for the 'autonomousSystems' query.
    const topHBQuery = `
      {
        topHoneyBadgers {
          ipAddress
        }
      }
    `

    // Query that can be used to get the autonomous systems associated with the IP address of a
    // honey badger.
    const asQuery = `
      query AutonomousSystems($ipAddresses: [String!]!) {
        autonomousSystems(ipAddresses: $ipAddresses) {
          ipAddress
          name
          asn
          countryCode
        }
      }
    `

    // Helper method to perform common basic validation on the 'autonomousSystems' query. Ought to
    // be invoked before more specific validation is done on the 'autonomousSystems' query.
    const validateAutonomousSystemsQuery = result => {
      expect(
        result.errors,
        `Didn't expect any errors but got: ${result.errors}`,
      ).to.be.undefined
      expect(result.data).to.exist
      expect(result.data.autonomousSystems).to.exist
    }

    it('Query can successfully be executed', async function() {
      // Increase the timeout in our unit test as our schema makes async calls to HoneyDB and
      // Apility
      this.timeout(25000)

      const {
        data: { topHoneyBadgers },
      } = await graphql(schema, topHBQuery)

      const result = await graphql(schema, asQuery, null, null, {
        ipAddresses: topHoneyBadgers.map(({ ipAddress }) => ipAddress),
      })

      validateAutonomousSystemsQuery(result)
    })

    it('Query returns the correct amount of results', async function() {
      // Increase the timeout in our unit test as our schema makes async calls to HoneyDB and
      // Apility
      this.timeout(25000)

      const {
        data: { topHoneyBadgers },
      } = await graphql(schema, topHBQuery)

      const result = await graphql(schema, asQuery, null, null, {
        ipAddresses: topHoneyBadgers.map(({ ipAddress }) => ipAddress),
      })

      validateAutonomousSystemsQuery(result)

      const {
        data: { autonomousSystems },
      } = result

      expect(autonomousSystems.length).to.equal(topHoneyBadgers.length)
    })
  })

  describe('Query: geoLocations', function() {
    // Query that can be used to get the list of top honey badgers. Meant to get IP addresses so
    // they can be supplied to the arguments for the 'geoLocations' query.
    const topHBQuery = `
      {
        topHoneyBadgers {
          ipAddress
        }
      }
    `

    // Query that can be used to get the geospatial locations associated with the IP address of a
    // honey badger.
    const geoLocationsQuery = `
      query GeoLocations($ipAddresses: [String!]!) {
        geoLocations(ipAddresses: $ipAddresses) {
          ipAddress
          latitude
          longitude
          country
          continent
        }
      }
    `

    // Helper method to perform common basic validation on the 'geoLocations' query. Ought to be
    // invoked before more specific validation is done on the 'geoLocations' query.
    const validateGeoLocationsQuery = result => {
      expect(
        result.errors,
        `Didn't expect any errors but got: ${result.errors}`,
      ).to.be.undefined
      expect(result.data).to.exist
      expect(result.data.geoLocations).to.exist
    }

    it('Query can successfully be executed', async function() {
      // Increase the timeout in our unit test as our schema makes async calls to HoneyDB and
      // Apility
      this.timeout(25000)

      const {
        data: { topHoneyBadgers },
      } = await graphql(schema, topHBQuery)

      const result = await graphql(schema, geoLocationsQuery, null, null, {
        ipAddresses: topHoneyBadgers.map(({ ipAddress }) => ipAddress),
      })

      validateGeoLocationsQuery(result)
    })

    it('Query returns the correct amount of results', async function() {
      // Increase the timeout in our unit test as our schema makes async calls to HoneyDB and
      // Apility
      this.timeout(25000)

      const {
        data: { topHoneyBadgers },
      } = await graphql(schema, topHBQuery)

      const result = await graphql(schema, geoLocationsQuery, null, null, {
        ipAddresses: topHoneyBadgers.map(({ ipAddress }) => ipAddress),
      })

      validateGeoLocationsQuery(result)

      const {
        data: { geoLocations },
      } = result

      expect(geoLocations.length).to.equal(topHoneyBadgers.length)
    })
  })

  describe('Query: blacklists', function() {
    // Query that can be used to get the list of top honey badgers. Meant to get IP addresses so
    // they can be supplied to the arguments for the 'blacklists' query.
    const topHBQuery = `
      {
        topHoneyBadgers {
          ipAddress
        }
      }
    `

    // Query that can be used to get the blacklist info associated with the IP address of a honey
    // badger.
    const blacklistsQuery = `
      query Blacklists($ipAddresses: [String!]!) {
        blacklists(ipAddresses: $ipAddresses) {
          ipAddress
          blacklists
        }
      }
    `

    // Helper method to perform common basic validation on the 'blacklists' query. Ought to be
    // invoked before more specific validation is done on the 'blacklists' query.
    const validateBlacklistsQuery = result => {
      expect(
        result.errors,
        `Didn't expect any errors but got: ${result.errors}`,
      ).to.be.undefined
      expect(result.data).to.exist
      expect(result.data.blacklists).to.exist
    }

    it('Query can successfully be executed', async function() {
      // Increase the timeout in our unit test as our schema makes async calls to HoneyDB and
      // Apility
      this.timeout(25000)

      const {
        data: { topHoneyBadgers },
      } = await graphql(schema, topHBQuery)

      const result = await graphql(schema, blacklistsQuery, null, null, {
        ipAddresses: topHoneyBadgers.map(({ ipAddress }) => ipAddress),
      })

      validateBlacklistsQuery(result)
    })

    it('Query returns the correct amount of results', async function() {
      // Increase the timeout in our unit test as our schema makes async calls to HoneyDB and
      // Apility
      this.timeout(25000)

      const {
        data: { topHoneyBadgers },
      } = await graphql(schema, topHBQuery)

      const result = await graphql(schema, blacklistsQuery, null, null, {
        ipAddresses: topHoneyBadgers.map(({ ipAddress }) => ipAddress),
      })

      validateBlacklistsQuery(result)

      const {
        data: { blacklists },
      } = result

      expect(blacklists.length).to.equal(topHoneyBadgers.length)
    })
  })
})
