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
