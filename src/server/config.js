/**
 * Config object that contains information/details to allow the app to function properly.
 * Information/details are gathered from environment variables. If the appropriate environment
 * variable isn't set then a default value is used. Note that some default values will cause the app
 * to no function properly, such as defaults for credentials for services that are used.
 */
const config = {
  // Config for the app/server
  app: {
    port: process.env.port || 3000,
  },
  // Service credentials
  serviceCreds: {
    honeyDB: {
      id: process.env.HONEYDB_API_AUTH_ID || 'No API auth ID found!',
      key: process.env.HONEYDB_API_AUTH_KEY || 'No API auth key found!',
    },
  },
}

export default config
