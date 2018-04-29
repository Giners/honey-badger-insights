import 'isomorphic-fetch'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

import React from 'react'
import List, { ListItem, ListItemText } from 'material-ui/List'

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
export const initialState = { honeyBadgers: [], error: null }

class App extends React.Component {
  constructor() {
    super()

    this.state = initialState
  }

  componentDidMount() {
    apolloClient
      .query({
        query: gql`
          {
            topHoneyBadgers {
              ipAddress
              count
            }
          }
        `,
      })
      .then(res => {
        const honeyBadgers = res.data.topHoneyBadgers

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
      <List>
        {honeyBadgers.map(({ ipAddress = 'IP address missing' } = {}) => (
          <ListItem key={ipAddress}>
            <ListItemText primary={ipAddress} />
          </ListItem>
        ))}
      </List>
    )
  }
}

export default App
