import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'
import { closeMongDbConnection, dropSessionCollection, mongoInit } from './Databases/mongoDb'
import { prepareDbforTests, sqlClose, sqlInit } from './Databases/sql'
import { closeRabbitMqConnection, connectRabbitMq } from './rabbitMq'
import { loginRoute } from './routes/api/login'

import { validatedServicesDetails } from '../../servicesDetails'
import { identifyUserRoute } from './routes/api/me'

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

  server.ext({
    type: 'onPostAuth',
    method: function (request, h) {
      //do something before every response send

      console.log('I am in onPostAuth')

      console.log(request.payload)

      request.payload['kiscica'] = 'kismacska'

      console.log(request.payload)

      return h.continue
    },
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
