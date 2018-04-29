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
  const expectedSchemaQueries = 1

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

    // Helper method to perform common basic validation on the 'honeyBadgers' query. Ought to be
    // invoked before more specific validation is done on the 'honeyBadgers' query.
    const validateTopHoneyBadgersQuery = result => {
      expect(
        result.errors,
        `Didn't expect any errors but got: ${result.errors}`,
      ).to.be.undefined
      expect(result.data).to.exist
      expect(result.data.topHoneyBadgers).to.exist
    }

    it('Query returns the top honey badgers details', async function() {
      // Increase the timeout in our unit test as our schema makes async calls to HoneyDB
      this.timeout(15000)

      const result = await graphql(schema, query)

      validateTopHoneyBadgersQuery(result)
    })

    it('Query returns at most 100 honey badgers', async function() {
      // Increase the timeout in our unit test as our schema makes async calls to HoneyDB
      this.timeout(15000)

      const result = await graphql(schema, query)

      validateTopHoneyBadgersQuery(result)

      // At most the 'topHoneyBadgers' query will return 100 entries
      expect(result.data.topHoneyBadgers.length).to.be.at.most(100)
    })
  })
})
