import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'
import { closeMongDbConnection, mongoInit } from './Databases/mongoDb'
import { prepareDbforTests, sqlClose, sqlInit } from './Databases/sql'
import { closeRabbitMqConnection, connectRabbitMq } from './rabbitMq'
import { loginRoute } from './routes/api/login'

import { identifyUserRoute } from './routes/api/me'
import { globalErrorhandler } from './utils/globalErrorHandler'
import { registerRoute } from './routes/api/register'
import { registerconfirmationRoute } from './routes/api/registerConfirmation'
import { forgotPasswordRequestRoute } from './routes/api/forgotPasswordRequest'
import { changePasswordAfterForgotPasswordRequestRoute } from './routes/api/changePasswordAfterForgotPasswordRequest'
import { validatedWebProcessServerVariables } from './validation/server'
import { redisClose, redisInIt } from './Databases/redis'

const { host, port, nodeEnv } = validatedWebProcessServerVariables

export let server: Server = Hapi.server({
  port: port,
  host: host,
  routes: {
    cors: true,
  },
})

export const serverInit = async () => {
  server.route([
    registerconfirmationRoute,
    loginRoute,
    identifyUserRoute,
    registerRoute,
    forgotPasswordRequestRoute,
    changePasswordAfterForgotPasswordRequestRoute,
  ])

  server.ext('onPreResponse', globalErrorhandler)

  await server.start()

  console.log(`Auth web service has been started http://${host}:${port}`)

  return server
}

export const serverStart = async () => {
  try {
    await sqlInit()

    await redisInIt()
    await connectRabbitMq()
    await serverInit()

    if (nodeEnv === 'seed') await prepareDbforTests()

    return server
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

export const serverStop = async () => {
  console.log('Auth web service closing')

  await server.stop()
  await redisClose()

  await sqlClose()
}

process.on('SIGINT', async (err) => {
  await serverStop()
  process.exit(0)
})
