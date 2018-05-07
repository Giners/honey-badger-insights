# Honey Badger Insights

[![Build Status](https://travis-ci.org/Giners/honey-badger-insights.svg?branch=master)](https://travis-ci.org/Giners/honey-badger-insights)

# Setup

The app leverages several sources of data to provide the insights into honeypot intrusions. Some of the data sources require authentication/authorization to use. What follows are instructions for setting up your environment to make use of the data sources.

## HoneyDB

The app leverages a threat intelligence data feed from a source named HoneyDB. HoneyDB provides real-time data about honeypot activity. HoneyDB requires authentication in order to use its data APIs. You can navigate [here](https://riskdiscovery.com/honeydb/#login) to login to HoneyDB with your GitHub account. After logging in to HoneyDB you will then be presented an API ID. Along with the API ID generate a key for accessing the threat information APIs of HoneyDB. You then need to make both the API ID and key available to the app so it can authenticate with HoneyDB. To do so you can set the environment variables named `HONEYDB_API_AUTH_ID` and `HONEYDB_API_AUTH_KEY`.

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

## Apility

The app leverages a threat intelligence data feed from a source named Apility. Apility provides real-time data about whether or not an entity (IP address) has been classified as an "abuser" by companies that maintain security lists/data. Apility requires authentication in order to use its data APIs. You can navigate [here](https://dashboard.apility.io/#/register) to register with Apility. After logging in to Apility you will be presented a dashboard which has a API key associated with your account. You need to make the API key available to the app so it can authenticate with Apility. To do so you can set the environment variable named `APILITY_API_AUTH_TOKEN`.

```shell
$ export APILITY_API_AUTH_TOKEN=<Your Apility auth key>
```

Alternatively you can modify the config file at `src/server/config.js` to provide your API key. Modify the file so it looks like the following:

```javascript
const config = {
  // ... other config
  // Service credentials
  serviceCreds: {
    apility: {
      token: process.env.APILITY_API_AUTH_TOKEN || 'Your Apility auth key',
    },
  },
}

export default config
```

## Google Maps JavaScript API

The app leverages the Google Maps JavaScript API to display a map of a geospatial location (i.e. latitude/longitude) of a honey badger relative to the city they were tracked to. To make use of the Google Maps JavaScript API you need to both enable it and generate an API key. To do so:

* Enable the Google Maps JavaScript API
* Obtain a Google API key

You can do all of these things from your Google developers console here: https://console.developers.google.com

After obtaining your Google API key you need to config the app to use it. Edit the file at `public/index.html` and modify the `<script>` element in the `<head>` that loads the Google Maps JavaScript API and replace `YOUR_GOOGLE_API_KEY` with your API key. The `public/index.html` ought to look like the following:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Other elements in the head ... -->
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=BIzaSyBitMQbVSfc7mg-dMEl_bQhJx7xmp9rcB0"></script>
  </head>
  <body>
    <!-- Other elements in the body ... -->
  </body>
</html>
```

## Returning Mock Data

Some of the 3rd party services that the app leverages set data/consumption limits/quotas. When doing development work with the app these limits/quotas could potentially be hit depending on the service tier you have signed up for. To this end mock data may be returned from the GraphQL service/API endpoint to avoid hitting your limits/quotas. The mock data returned is the same as the data returned by the 3rd party services except its not realtime data. To cause the GraphQL service/API endpoint to return mock data you can set the environment variable `RETURN_MOCK_DATA` to `true`.

Setting the environment variable `RETURN_MOCK_DATA` to `true` will cause mock data to be returned while running the server/GraphQL service/API endpoint as well as during testing. Note that this feature **shouldn't be used in production**.

# License

[MIT](https://gine.mit-license.org/)
