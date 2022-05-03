import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'

import { validatedServicesDetails } from '../servicesDetails'
import { getGroceryCategories, getGroups, sqlInit } from './databases/sql'
import { getCategoriesWithItems } from './routes/api/category/getCategoriesWithItems'
import { getGroupsRoute } from './routes/api/group/getGroups'

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
        const y = getGroups(1)
        const x = await getGroceryCategories(0, 1)
        return y
      },
    },
    getGroupsRoute,
    getCategoriesWithItems,
  ])

  //        const x = await getGroceryCategories(0, 1) just own categories
  server.ext('onPreResponse', (request: Hapi.Request, h) => {
    console.log('i am in the preresponse')
    const response = request.response

    console.log(response.isBoom)
    if (!response.isBoom) {
      // if not error then continue :)
      return h.continue
    }
    console.log(response)
    return h.response({})
  })
  //get group lists

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
