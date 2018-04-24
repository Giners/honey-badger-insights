import honeyBadgerApp from './honeyBadgerApp'
import config from './config'

const { env } = honeyBadgerApp.settings

honeyBadgerApp.listen(config.app.port, () => {
  // eslint-disable-next-line no-console
  console.log(`HoneyBadgerApp now listening on port ${config.app.port} in '${env}' environment/mode`)
})
