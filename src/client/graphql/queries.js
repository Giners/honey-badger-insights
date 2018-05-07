import gql from 'graphql-tag'

export const topHoneyBadgersQuery = gql`
  {
    topHoneyBadgers {
      ipAddress
      count
    }
  }
`

export const autonomousSystemsQuery = gql`
  query AutonomousSystems($ipAddresses: [String!]!) {
    autonomousSystems(ipAddresses: $ipAddresses) {
      ipAddress
      name
      asn
      countryCode
    }
  }
`

export const geoLocationsQuery = gql`
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

export const blacklistsQuery = gql`
  query Blacklists($ipAddresses: [String!]!) {
    blacklists(ipAddresses: $ipAddresses) {
      ipAddress
      blacklists
    }
  }
`
