import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'
import { closeMongDbConnection, dropSessionCollection, mongoInit } from './Databases/mongoDb'
import { prepareDbforTests, sqlClose, sqlInit } from './Databases/sql'
import { closeRabbitMqConnection, connectRabbitMq } from './rabbitMq'
import { loginRoute } from './routes/api/login'

import { validatedServicesDetails } from '../../servicesDetails'
import { identifyUserRoute } from './routes/api/me'
import Joi from 'joi'

const { authServiceHost, authServicePort } = validatedServicesDetails

export let server: Server = Hapi.server({
  port: authServicePort,
  host: authServiceHost,
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
    { method: 'POST', path: '/test', handler: () => 'ok' },
    loginRoute,
    identifyUserRoute,
  ])

  server.ext('onPreResponse', (request: Hapi.Request, h) => {
    console.log('i am in the preresponse')
    const response = request.response

    if (!response.isBoom) {
      // if not error then continue :)
      return h.continue
    }

    let errorResponseMap = new Map()

    errorResponseMap.set(401, {
      code: 401,
      isValid: false,
      errorMessage: response.message,
      hashValue: null,
      error: null,
      isAdmin: false,
    })

    errorResponseMap.set(403, {
      code: 403,
      isValid: false,
      errorMessage: response.message,
      hashValue: null,
      error: null,
      isAdmin: false,
    })

    errorResponseMap.set(400, {
      code: 400,
      isValid: false,
      errorMessage: 'RequestBody Validation Failed',
      hashValue: null,
      error: response['details'],
      isAdmin: false,
    })

    errorResponseMap.set(500, {
      code: 500,
      isValid: false,
      errorMessage: response.message ? response.message : 'Fatal error',
      hashValue: null,
      error: null,
      isAdmin: false,
    })

    let errorResponseBody

    console.log(response.message)

    if (Joi.isError(response)) errorResponseBody = errorResponseMap.get(400)
    else if (response.code === 403) errorResponseBody = errorResponseMap.get(response.code)
    else if (response.code === 401) errorResponseBody = errorResponseMap.get(response.code)
    else errorResponseBody = errorResponseMap.get(500)

    return h.response(errorResponseBody).code(errorResponseBody?.code)
  })

  await server.start()
  console.log(`Auth web service has been started http://${authServiceHost}:${authServicePort}`)

  return server
}

export const serverStart = async () => {
  try {
    await sqlInit()
    await mongoInit()
    await connectRabbitMq()
    await serverInit()
    await prepareDbforTests()
    // await dropSessionCollection()

    return server
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

export const serverStop = async () => {
  console.log('Auth web service closing')

  await server.stop()
  await closeMongDbConnection()
  await sqlClose()
  await closeRabbitMqConnection()
}

process.on('SIGINT', async (err) => {
  await serverStop()
  process.exit(0)
})
