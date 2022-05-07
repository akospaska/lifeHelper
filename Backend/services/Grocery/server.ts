import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'

import { sqlInit } from './databases/sql'
import { createCategoryRoute } from './routes/api/category/createCategory'
import { deleteCategoryRoute } from './routes/api/category/deleteCategory'
import { getCategoriesRoute } from './routes/api/category/getCategories'
import { getCategoriesWithItems } from './routes/api/category/getCategoriesWithItems'
import { modifyCategoryRoute } from './routes/api/category/modifyCategory'
import { createGroceryItemRoute } from './routes/api/groceryItem/createGroceryItem'
import { deleteGroceryItemRoute } from './routes/api/groceryItem/deleteGroceryItem'
import { createGroupRoute } from './routes/api/group/createGroup'
import { deleteGroupRoute } from './routes/api/group/deleteGroup'
import { getGroupsRoute } from './routes/api/group/getGroups'
import { globalErrorhandler } from './utils/errorHandling'
import { validatedServerVariablesSchema } from './validation/server'

const { host, port } = validatedServerVariablesSchema

export let server: Server = Hapi.server({
  port: port,
  host: host,
  routes: {
    cors: true,
  },
})

export const serverInit = async () => {
  server.route([
    //Categories
    getCategoriesWithItems,
    modifyCategoryRoute,
    deleteCategoryRoute,
    getCategoriesRoute,
    createCategoryRoute,
    //Groups
    getGroupsRoute,
    createGroupRoute,
    deleteGroupRoute,
    //GroceryItem
    createGroceryItemRoute,
    deleteGroceryItemRoute,
  ])

  server.ext('onPreResponse', globalErrorhandler)

  await server.start()

  return server
}

export const serverStart = async () => {
  try {
    await sqlInit()
    await serverInit()

    console.log(`Grocery Service has been started on port:${port}`)

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
