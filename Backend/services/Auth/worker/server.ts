import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'

import Joi from 'joi'

import { globalJoiOptions } from '../utils/joi/index'

export const environmentVariablesValidation = Joi.object<environmentVariables>({
  port: Joi.string().required(),
  host: Joi.string().min(1).required(),
  apiGatewayPort: Joi.string().required(),
  apiGatewayHost: Joi.string().required(),
  emailKey1: Joi.string().required(),
  emailKey2: Joi.string().required(),
  rabbitMqHost: Joi.string().required(),
  nodeEnv: Joi.string().length(3).required(),
  publicHost: Joi.required(),
})

interface environmentVariables {
  port: string
  host: string
  apiGatewayPort: string
  apiGatewayHost: string
  emailKey1: string
  emailKey2: string
  rabbitMqHost: string
  nodeEnv: string
  publicHost: string
}

const environmentVariables = {
  port: process.env.AUTH_WORKER_PORT,
  host: process.env.AUTH_WORKER_HOST,
  emailKey1: process.env.EMAIL_KEY1,
  emailKey2: process.env.EMAIL_KEY2,
  rabbitMqHost: process.env.RABBITMQ_HOST,
  apiGatewayPort: process.env.API_GATEWAY_PORT,
  apiGatewayHost: process.env.API_GATEWAY_HOST,
  nodeEnv: process.env.NODE_ENV,
  publicHost: process.env.PUBLIC_PRD_GATEWAY_HOST,
}

export const validatedEnvironmentVariables: environmentVariables = Joi.attempt(
  environmentVariables,
  environmentVariablesValidation,
  globalJoiOptions
)

const { port, host } = validatedEnvironmentVariables

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
  console.log(`worker service has been started http://${host}:${port}`)

  await process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit()
  })

  return server
}

import { rabbitMqConnectionClose } from './rabbitMq'

import { connectRabbitMq } from './rabbitMq'

export const serverStart = async () => {
  try {
    await serverInit()
    connectRabbitMq()

    return server
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

export const serverStop = async (timeout: number = 0) => {
  await server.stop({ timeout })
  await rabbitMqConnectionClose()
  console.log('worker server closed')
}
;['SIGINT', 'sigkill', 'JORTE'].forEach((signal) => process.on(signal, serverStop))
