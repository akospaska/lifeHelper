import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'

import { globalErrorhandler } from './utils/errorHandling'
import { validatedServerVariablesSchema } from './validation/server'

import { sqlInit } from './databases/sql'

const { host, port } = validatedServerVariablesSchema

import { ResponseToolkit, Request } from 'hapi'

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
      handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
        const response = h.response({ message: 'Baby tracker works' }).code(200)

        return response
      },
    },
  ])

  server.ext('onPreResponse', globalErrorhandler)

  await server.start()

  return server
}

export const serverStart = async () => {
  try {
    await sqlInit()
    await serverInit()

    // if (process.env.NODE_ENV === 'seed') await prepareDbforTests()

    console.log(`weightTracker Service has been started on port:${port}`)

    return server
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

export const serverStop = async () => {
  console.log('weightTracker service closing')

  await server.stop()
}

process.on('SIGINT', async (err) => {
  await serverStop()
  process.exit(0)
})
