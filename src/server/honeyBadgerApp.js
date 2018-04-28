import express from 'express'
import cors from 'cors'

import config from './config'
import apiService from './services/apiService'

/**
 * An Express application. Express is a minimalist web framework and is responsible for handling the
 * HTTP requests sent to a host server. It has already been configured to make use of 3rd-party
 * middleware to facilitate the processing of HTTP requests but also to make use of middleware to
 * expose the services of our app.
 *
 * A server can be started from this by invoking the 'listen()' method. It will start a UNIX socket
 * and listen for connections on a given path. This method is identical to Node's
 * 'http.Server.listen()' method.
 *
 * @example
 * const port = 3000
 *
 * honeyBadgerApp.listen(port, () => {
 *   console.log(`HoneyBadgerApp now listening on port ${port}`)
 * })
 */
const honeyBadgerApp = express()

// Use 'cors' middleware to enable all CORS requests
honeyBadgerApp.use(cors())

// Handle API requests to our app
honeyBadgerApp.use(config.serviceURIs.graphQL, apiService)

export default honeyBadgerApp
