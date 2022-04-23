import * as Hapi from '@hapi/hapi'

import { Server, ResponseToolkit, Request } from 'hapi'
import { sqlInit } from './Databases/sql'
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
  console.log(`Auth web service has been started http://${host}:${port}`)

  return server
}

export const serverStart = async () => {
  try {
    await sqlInit()
    await serverInit()

    return server
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

export const serverStop = async (timeout: number = 0) => {
  console.log('Auth web service closing')
  await server.stop({ timeout })
}

process.on('SIGINT', async (err) => {
  serverStop(10000)
  process.exit(0)
})

export const dbsStart = async () => {
  return true
}
