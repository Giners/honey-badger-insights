import honeyBadgerApp from './honeyBadgerApp'
import config from './config'

const { env } = honeyBadgerApp.settings

honeyBadgerApp.listen(config.app.port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `HoneyBadgerApp now listening on port ${
      config.app.port
    } in '${env}' environment/mode`,
  )
  // eslint-disable-next-line no-console
  console.log(
    `GraphQL schema/API endpoint returning mock data? ${
      config.app.returnMockData ? 'TRUE' : 'FALSE'
    }`,
  )
})
