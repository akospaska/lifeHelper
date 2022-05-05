import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'
import { closeMongDbConnection, mongoInit } from './Databases/mongoDb'
import { isTheAccountAdmin, prepareDbforTests, sqlClose, sqlInit } from './Databases/sql'
import { closeRabbitMqConnection, connectRabbitMq } from './rabbitMq'
import { loginRoute } from './routes/api/login'

import { validatedServicesDetails } from '../../servicesDetails'
import { identifyUserRoute } from './routes/api/me'
import { globalErrorhandler } from './utils/globalErrorHandler'
import { registerAttemptMessageBody, sendRegisterAttemptQueue } from './rabbitMq/queue/registerAttempt'
import { registerRoute } from './routes/api/register'
import { registerconfirmationRoute } from './routes/api/registerConfirmation'
import { forgotPasswordRequestRoute } from './routes/api/forgotPasswordRequest'

const { authServiceHost, authServicePort } = validatedServicesDetails

export let server: Server = Hapi.server({
  port: authServicePort,
  host: authServiceHost,
  routes: {
    cors: true,
  },
})

export const serverInit = async () => {
  server.route([registerconfirmationRoute, loginRoute, identifyUserRoute, registerRoute, forgotPasswordRequestRoute])

  server.ext('onPreResponse', globalErrorhandler)

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
