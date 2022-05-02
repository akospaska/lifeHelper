import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'
import { validatedServicesDetails } from '../servicesDetails'
import { loginRoute } from './routes/api/auth/login'
import { identifyRoute } from './routes/api/auth/me'
import { getCategoriesWithItems } from './routes/api/grocery/category/getCategories'
import { getGroupsRoute } from './routes/api/grocery/group/getGroups'
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

server.ext({
  type: 'onRequest',
  method: function (request, h) {
    // Change all requests to '/test'
    console.log('--------------------------------------------------')
    console.log('onRequest')
    // return h.response({ asd: 'asd' }).takeover()
    return h.continue
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
    getGroupsRoute,
    getCategoriesWithItems,
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
