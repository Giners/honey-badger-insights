# Honey Badger Insights

[![Build Status](https://travis-ci.org/Giners/honey-badger-insights.svg?branch=master)](https://travis-ci.org/Giners/honey-badger-insights)

# Setup

The app leverages several sources of data to provide the insights into honeypot intrusions. Some of the data sources require authentication/authorization to use. What follows are instructions for setting up your environment to make use of the data sources.

## HoneyDB

The app leverages a threat intelligence data feed from a source named HoneyDB. HoneyDB provides real-time data about honeypot activity. HoneyDB requires that authentication in order to use its data APIs. You can navigate [here](https://riskdiscovery.com/honeydb/#login) to login to HoneyDB with your GitHub account. After logging in to HoneyDB you will then be presented an API ID. Along with the API ID generate a key for accessing the threat information APIs of HoneyDB. You then need to make both the API ID and key available to the app so it can authenticate with HoneyDB. To do so you can set the environment variables named `HONEYDB_API_AUTH_ID` and `HONEYDB_API_AUTH_KEY`.

```shell
$ export HONEYDB_API_AUTH_ID=<Your HoneyDB API auth ID>
$ export HONEYDB_API_AUTH_KEY=<Your HoneyDB API auth key>
```

Alternatively you can modify the config file at `src/server/config.js` to provide your API ID and auth key. Modify the file so it looks like the following:

```javascript
const config = {
  // ... other config
  // Service credentials
  serviceCreds: {
    honeyDB: {
      id: process.env.HONEYDB_API_AUTH_ID || 'Your HoneyDB API auth ID',
      key: process.env.HONEYDB_API_AUTH_KEY || 'Your HoneyDB API auth key',
    },
  },
}

export default config
```

# License

[MIT](https://gine.mit-license.org/)
