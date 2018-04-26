import React from 'react'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

import config from './../../server/config'

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: `${config.app.hostURL}:${config.app.port}${
      config.serviceURIs.graphQL
    }`,
  }),
  cache: new InMemoryCache(),
})

class App extends React.Component {
  constructor() {
    super()

    this.state = { honeyBadgers: [], error: null }
  }

  componentDidMount() {
    apolloClient
      .query({
        query: gql`
          {
            honeyBadgers {
              ipAddress
            }
          }
        `,
      })
      .then(res => {
        const { honeyBadgers } = res.data

        // If we successfully got a request from our GraphQL API endpoint, presume that any previous
        // errors aren't relevant anymore
        this.setState({ honeyBadgers, error: null })
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  render() {
    const { honeyBadgers, error } = this.state

    if (error) {
      return `The following error occurred: ${error}`
    }

    return (
      <ul>
        {honeyBadgers.map(({ ipAddress }) => (
          <li key={ipAddress}>{ipAddress}</li>
        ))}
      </ul>
    )
  }
}

export default App
