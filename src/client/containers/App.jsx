import 'isomorphic-fetch'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import React from 'react'

import HoneyBadgersTable from './../components/HoneyBadgersTable'
import {
  autonomousSystemsQuery,
  geoLocationsQuery,
  topHoneyBadgersQuery,
} from './../graphql/queries'
import config from './../../server/config'

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: `${config.app.hostURL}:${config.app.port}${
      config.serviceURIs.graphQL
    }`,
  }),
  cache: new InMemoryCache(),
})

/** The initial state of the App component when it is mounted. Exported for testing purposes. */
export const initialState = { honeyBadgers: new Map(), error: null }

/**
 * The <App> component is a stateful React component that is responsible for providing the "root"
 * for our visual and logical React components that make up our app. Its most important job is to
 * query for information about honey badgers and then to pass that information along to child
 * components so they can render it into a meaningful visualization.
 */
class App extends React.Component {
  /**
   * Helper method that makes a query to the GraphQL service/API endpoint for the top honey badgers
   * that have been seen in the past 24 hours.
   *
   * @return {Promise<Map<string, HoneyBadger>, error>} Returns a promise where it is resolved to a
   * map that contains info about the top honey badgers. The map is keyed off of the honey badgers
   * IP address. Should this fail to query the GraphQL service/API endpoint or for any other reason
   * this promise will be rejected with the error.
   */
  static async collectTopHoneyBadgersInfo() {
    const { topHoneyBadgers } = (await apolloClient.query({
      query: topHoneyBadgersQuery,
    })).data

    const thbKVPs = topHoneyBadgers.map(topHoneyBadger => [
      topHoneyBadger.ipAddress,
      topHoneyBadger,
    ])
    return new Map(thbKVPs)
  }

  /**
   * Helper method that given a map of honey badgers where they are keyed off of their IP address
   * will make a query to the GraphQL service/API endpoint for said honey badger for info about the
   * autonomous systems that is responsible/in charge of said honey badger.
   *
   * Note that this function isn't pure and has side effects in that it modifies the map of honey
   * badgers passed into it to add in the info about the autonomous systems that has been
   * collected.
   *
   * @param {Map<string, HoneyBadger>} honeyBadgers - Map of honey badgers where they are keyed off
   * of their IP address
   *
   * @return {Promise<undefined, error>} Returns a promise where it will resolve if able to
   * successfully query for info about autonomous systems as well as add the info to the map of
   * honey badgers that is passed into it. Should we fail to query the GraphQL service/API endpoint
   * or for any other reason this promise will be rejected with the error.
   */
  static async collectAutonomousSystemsInfo(honeyBadgers) {
    const ipAddresses = [...honeyBadgers.keys()]

    const { autonomousSystems } = (await apolloClient.query({
      query: autonomousSystemsQuery,
      variables: { ipAddresses },
    })).data

    // Join the data about the autonomous system that the honey badger falls under with the
    // existing data about honey badgers
    autonomousSystems.forEach(({ ipAddress, ...rest }) => {
      const honeyBadger = honeyBadgers.get(ipAddress)

      honeyBadgers.set(ipAddress, { ...honeyBadger, as: { ...rest } })
    })
  }

  /**
   * Helper method that given a map of honey badgers where they are keyed off of their IP address
   * will make a query to the GraphQL service/API endpoint for said honey badger for info about
   * where said honey badger is located geospatially.
   *
   * Note that this function isn't pure and has side effects in that it modifies the map of honey
   * badgers passed into it to add in the info about the locations that has been collected.
   *
   * @param {Map<string, HoneyBadger>} honeyBadgers - Map of honey badgers where they are keyed off
   * of their IP address
   *
   * @return {Promise<undefined, error>} Returns a promise where it will resolve if able to
   * successfully query for info about the locations as well as add the info to the map of honey
   * badgers that is passed into it. Should we fail to query the GraphQL service/API endpoint
   * or for any other reason this promise will be rejected with the error.
   */
  static async collectGeoLocationsInfo(honeyBadgers) {
    const ipAddresses = [...honeyBadgers.keys()]

    const { geoLocations } = (await apolloClient.query({
      query: geoLocationsQuery,
      variables: { ipAddresses },
    })).data

    // Join the data about the location of the honey badger with the existing data about honey
    // badgers
    geoLocations.forEach(({ ipAddress, ...rest }) => {
      const honeyBadger = honeyBadgers.get(ipAddress)

      honeyBadgers.set(ipAddress, { ...honeyBadger, geoLocation: { ...rest } })
    })
  }

  /**
   * Creates a new stateful React component that is responsible for providing the "root" for the
   * visual and logical React components that make up the app.
   */
  constructor() {
    super()

    this.state = initialState
  }

  /**
   * React component lifecycle method that will be called after the <App> component has been mounted
   * into the DOM. After which we make calls to our GraphQL service/API endpoint to collect
   * information about honey badgers and update our state with it.
   */

  // It is okay to call 'setState()' in 'componentDidMount()' as discussed in the React docs
  /* eslint-disable react/no-did-mount-set-state */
  async componentDidMount() {
    try {
      // Query for the top honey badgers from our GraphQL service/API endpoint and enqueue a request
      // to set the apps state to the honey badgers
      const honeyBadgers = await App.collectTopHoneyBadgersInfo()

      this.setState({ honeyBadgers })

      // Now collect the following info about honey badgers from our GraphQL service/API endpoint
      // and enqueue a request to set the state of the app with the new info we collected:
      // * The autonomous systems that oversee the IP address of the honey badger
      // * The geospatial location of a honey badgers IP address
      await App.collectAutonomousSystemsInfo(honeyBadgers)
      this.setState({ honeyBadgers })

      await App.collectGeoLocationsInfo(honeyBadgers)
      this.setState({ honeyBadgers })
    } catch (error) {
      // It is okay to call 'setState()' in 'componentDidMount()' as discussed in the React docs
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ error })
    }
  }

  render() {
    const { honeyBadgers, error } = this.state

    if (error) {
      return `The following error occurred: ${error}`
    }

    return <HoneyBadgersTable honeyBadgers={honeyBadgers} />
  }
}

export default App
