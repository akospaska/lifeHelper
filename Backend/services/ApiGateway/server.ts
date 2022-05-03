import * as Hapi from '@hapi/hapi'

import axios, { AxiosResponse } from 'axios'

import { Server } from 'hapi'
import { cookieParser } from '../../utils/cookieParser'

import { validatedServicesDetails } from '../servicesDetails'
import { authServiceApi } from './api/services/authService'
import { loginRoute } from './routes/api/auth/login'
import { identifyRoute } from './routes/api/auth/me'
import { getCategoriesWithItems } from './routes/api/grocery/category/getCategories'
import { getGroupsRoute } from './routes/api/grocery/group/getGroups'
import { authorizationSchema } from './utils/authorization'
import { validatedWebProcessServerVariables } from './validation/server'
const { port, host } = validatedWebProcessServerVariables

const { apiGatewayHost, apiGatewayPort, authServiceHost, authServicePort } = validatedServicesDetails

export let server: Server = Hapi.server({
  port: apiGatewayPort,
  host: apiGatewayHost,
  routes: {
    cors: true,
  },
})

server.auth.scheme('authenticationBySessionSchema', authorizationSchema)
server.auth.strategy('authByCookieSession', 'authenticationBySessionSchema')

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

  server.ext({
    type: 'onPostAuth',
    method: function (request, h) {
      //do something before every response send

      /* console.log('I am in onPostAuth')

      console.log(request.payload)

      request.payload['kiscica'] = 'kismacska'

      console.log(request.payload)
*/

      return h.continue
    },
  })

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
