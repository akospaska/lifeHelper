import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'

import { validatedServicesDetails } from '../servicesDetails'
import { getGroceryCategories, sqlInit } from './databases/sql'

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
      handler: async function (request, reply) {
        const x = await getGroceryCategories(1, 1)
        return x
      },
    },
  ])

  await server.start()

  return server
}

export const serverStart = async () => {
  try {
    await sqlInit()
    await serverInit()

    console.log(`Grocery Service has been started on port:${groceryServicePort}`)

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
