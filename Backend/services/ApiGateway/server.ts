import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'
import { validatedServicesDetails } from '../servicesDetails'
import { loginRoute } from './routes/api/auth/login'
import { identifyRoute } from './routes/api/auth/me'
import { validatedWebProcessServerVariables } from './validation/server'
const { port, host } = validatedWebProcessServerVariables

const { apiGatewayHost, apiGatewayPort } = validatedServicesDetails

export let server: Server = Hapi.server({
  port: apiGatewayPort,
  host: apiGatewayHost,
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
    loginRoute,
    identifyRoute,
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

console.log(validatedServicesDetails)
