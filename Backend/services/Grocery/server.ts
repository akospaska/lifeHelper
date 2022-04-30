import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'

import { validatedServicesDetails } from '../servicesDetails'

const { groceryServiceHost, groceryServicePort } = validatedServicesDetails

export let server: Server = Hapi.server({
  port: groceryServicePort,
  host: groceryServiceHost,
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
  console.log('Auth web service closing')

  await server.stop()
}

process.on('SIGINT', async (err) => {
  await serverStop()
  process.exit(0)
})