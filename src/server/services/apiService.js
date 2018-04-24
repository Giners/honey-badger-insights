/**
 * Express middleware for an API service.
 *
 * @param {object} req - Represents the HTTP request making a request to the API service. Has
 * properties for the request query string, parameters, body, HTTP headers, and more. To learn more
 * about it you can visit this documentation: https://expressjs.com/en/4x/api.html#req
 * @param {object} res - Represents the HTPT response that is to contain the results of the API call
 * invoked by the HTTP request. To learn more about it you can visit the documentation:
 * https://expressjs.com/en/4x/api.html#res
 */
const apiService = (req, res) => {
  res.status(200).json({ status: 'API service is handling requests' }).end()
}

export default apiService
