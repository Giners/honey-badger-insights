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
