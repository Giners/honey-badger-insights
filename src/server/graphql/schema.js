// ESLint config
// We disable the ESLing rule 'camelcase' as the data returned to us by the 3rd party services we
// use is snake cased. We ourselves shouldn't look to use snake case but continue to use camelcased
// identifiers.
/* eslint-disable camelcase */

import { promisify } from 'util'
import { readFile } from 'fs'
import { resolve } from 'path'

import 'isomorphic-fetch'

import {
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'

import { ASType, GeoLocationType, TopHoneyBadgerType } from './types'

import config from './../config'

/**
 * The URL for the Apility API that returns the autonomous system info for a set of IPs. The API
 * expects the set of IPs as a list of comma separated IPs used as the last URI segment of this
 * URL (i.e. you need to add them).
 *
 * Note that the URL doesn't contain an ending '/' character. You need to add it before adding the
 * set of IPs as a list that is comma separated.
 */
const apilityASBatchAPIURL = 'https://api.apility.net/as_batch/ip'

/**
 * The URL for the Apility API that returns geospatial info for a set of IPs. The API expects the
 * set of IPs as a list of comma separated IPs used as the last URI segment of this URL (i.e. you
 * need to add them).
 *
 * Note that the URL doesn't contain an ending '/' character. You need to add it before adding the
 * set of IPs as a list that is comma separated.
 */
const apilityGeoIPBatchAPIURL = 'https://api.apility.net/geoip_batch'

/**
 * Apility auth header for accessing its APIs that identifies who is accessing the API based on a
 * token provided in the Apility dashboard
 */
const apilityAPIAuthTokenHeader = 'X-Auth-Token'

/**
 * Helper method to construct the URL used to query for the autonomous systems associated with a set
 * of IPs from Apility.
 *
 * @param {string[]} ipAddresses - Array of IP addresses to query for the autonomous system
 * associated with them. No checking/validation is done of this parameter so if anything but an
 * array of strings is passed will cause this function to break.
 *
 * @returns {string} - Formed URL that can be used to query for the autonomous systems associated
 * with a set of IPs from Apility
 */
const getApilityASBatchAPIURL = ipAddresses =>
  `${apilityASBatchAPIURL}/${ipAddresses.join(',')}`

/**
 * Helper method to construct the URL used to query for the geospatial info associated with a set of
 * IPs from Apility.
 *
 * @param {string[]} ipAddresses - Array of IP addresses to query for the geospatial info associated
 * with them. No checking/validation is done of this parameter so if anything but an array of
 * strings is passed will cause this function to break.
 *
 * @returns {string} - Formed URL that can be used to query for the geospatial info associated with
 * a set of IPs from Apility
 */
const getApilityGeoIPBatchAPIURL = ipAddresses =>
  `${apilityGeoIPBatchAPIURL}/${ipAddresses.join(',')}`

/** The URL for the HoneyDB API that returns a list of bad hosts from the last 24 hours */
const honeyDBBadHostsAPIURL = 'https://riskdiscovery.com/honeydb/api/bad-hosts'

/** HoneyDB auth header for accessing its APIs that identifies who is accessing the API */
const honeyDBAPIAuthIDHeader = 'X-HoneyDb-ApiId'

/** HoneyDB auth header for accessing its APIs that verifies who is accessing the API */
const honeyDBAPIAuthKeyHeader = 'X-HoneyDb-ApiKey'

/**
 * Used to limit how much data (honey badgers) we ultimately return. Can be increased but will end
 * up consuming a lot more "hits"/resources in regards to the limits that the APIs offer.
 */
const maxHoneyDBDatums = 25

/**
 * If 'true' the mock data will be read from disk and passed as the response to the GraphQL queries
 * and mutations. This is only meant to be used for testing purposes. Useful for unit testing to
 * reduce the consumption of API resources/limits for services we integrate with.
 */
const { returnMockData } = config.app

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
        // Return mock data from disk if signalled to do so
        if (returnMockData) {
          return promisify(readFile)(
            resolve(__dirname, './data/topHoneyBadgersData'),
          ).then(data => JSON.parse(data))
        }

        // If we aren't returning mock data from disk then query the HoneyDB service
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

            // Map the data returned by HoneyDB to return a type defined by our GraphQL schema.
            honeyBadgers = honeyBadgers.map(({ remote_host, count }) => ({
              ipAddress: remote_host,
              count,
            }))

            return honeyBadgers
          })
      },
      description: `Gets the top ${maxHoneyDBDatums} honey badgers from the last 24 hours based on how many times they have been seen`,
    },
    autonomousSystems: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ASType))),
      args: {
        ipAddresses: {
          type: new GraphQLNonNull(
            new GraphQLList(new GraphQLNonNull(GraphQLString)),
          ),
          description:
            'A list of honey badger IPs used to look up their associated autonomous system',
        },
      },
      resolve(parentNode, { ipAddresses }) {
        // Return mock data from disk if signalled to do so
        if (returnMockData) {
          return promisify(readFile)(
            resolve(__dirname, './data/autonomousSystemsData'),
          ).then(data => JSON.parse(data))
        }

        // If we aren't returning mock data from disk then query the Apility service
        const { token } = config.serviceCreds.apility
        const url = getApilityASBatchAPIURL(ipAddresses)

        return fetch(url, {
          headers: {
            [apilityAPIAuthTokenHeader]: token,
          },
        })
          .then(res => res.json())
          .then(json =>
            json.response.map(entry => {
              // Iterate over the entries in the response from Apility in regards to getting AS
              // details and form it into the data representation that is defined by the GraphQL
              // type that we return
              const {
                ip,
                as: { name, asn, country },
              } = entry

              return {
                ipAddress: ip,
                name,
                asn,
                countryCode: country,
              }
            }),
          )
      },
      description:
        'Gets the autonomous systems associated with the IP addresses of honey badgers',
    },
    geoLocations: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GeoLocationType)),
      ),
      args: {
        ipAddresses: {
          type: new GraphQLNonNull(
            new GraphQLList(new GraphQLNonNull(GraphQLString)),
          ),
          description:
            'A list of honey badger IPs used to look up their associated geospatial locations',
        },
      },
      resolve(parentNode, { ipAddresses }) {
        // Return mock data from disk if signalled to do so
        if (returnMockData) {
          return promisify(readFile)(
            resolve(__dirname, './data/geoLocationsData'),
          ).then(data => JSON.parse(data))
        }

        // If we aren't returning mock data from disk then query the Apility service
        const { token } = config.serviceCreds.apility
        const url = getApilityGeoIPBatchAPIURL(ipAddresses)

        return fetch(url, {
          headers: {
            [apilityAPIAuthTokenHeader]: token,
          },
        })
          .then(res => res.json())
          .then(json =>
            json.response.map(entry => {
              // Iterate over the entries in the response from Apility in regards to getting
              // geospatial location details and form it into the data representation that is
              // defined by the GraphQL type that we return
              const {
                ip,
                geoip: { latitude, longitude, country_names, continent_names },
              } = entry

              return {
                ipAddress: ip,
                latitude,
                longitude,
                country: country_names.en,
                continent: continent_names.en,
              }
            }),
          )
      },
      description:
        'Gets the geospatial locations associated with the IP addresses of honey badgers',
    },
  },
  description: 'The GraphQL queries available in the app',
})

/** The instance of our GraphQL schema that can be used in our app */
const schema = new GraphQLSchema({
  query: rootQueryType,
})

export default schema
