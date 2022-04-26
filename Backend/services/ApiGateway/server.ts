import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'
import { validatedWebProcessServerVariables } from './validation/server'
const { port, host } = validatedWebProcessServerVariables

export let server: Server = Hapi.server({
  port: port,
  host: host,
  routes: {
    cors: true,
  },
})

export const serverInit = async () => {
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        return 'Hello world!'
      },
    },
  ])

  await server.start()
  console.log(`ApiGateway service has been started http://${host}:${port}`)

  return server
}

export const serverStart = async () => {
  try {
    await serverInit()

    return server
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

export const serverStop = async () => {
  console.log('Gateway service closing')

  await server.stop()
}

process.on('SIGINT', async (err) => {
  await serverStop()
  process.exit(0)
})
