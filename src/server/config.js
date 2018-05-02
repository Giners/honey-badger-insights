/**
 * Config object that contains information/details to allow the app to function properly.
 * Information/details are gathered from environment variables. If the appropriate environment
 * variable isn't set then a default value is used. Note that some default values will cause the app
 * to no function properly, such as defaults for credentials for services that are used.
 */
const config = {
  // Config for the app/server
  app: {
    hostURL: process.env.HOST_URL || 'http://localhost',
    port: process.env.port || 3000,
    returnMockData: process.env.RETURN_MOCK_DATA || false,
  },
  // The URIs of our services
  serviceURIs: {
    graphQL: '/graphql',
  },
  // Service credentials
  serviceCreds: {
    apility: {
      token: process.env.APILITY_API_AUTH_TOKEN || 'No API auth token found!',
    },
    honeyDB: {
      id: process.env.HONEYDB_API_AUTH_ID || 'No API auth ID found!',
      key: process.env.HONEYDB_API_AUTH_KEY || 'No API auth key found!',
    },
  },
}

export default config
