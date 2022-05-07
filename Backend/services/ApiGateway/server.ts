import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'
import { changePasswordRequestRoute } from './routes/api/auth/changePasswordAfterForgotPasswordRequest'
import { forgotPasswordRequestRoute } from './routes/api/auth/forgotPasswordRequest'

import { loginRoute } from './routes/api/auth/login'
import { identifyRoute } from './routes/api/auth/me'
import { registerRoute } from './routes/api/auth/register'
import { registerConfirmationRoute } from './routes/api/auth/registerConfirmation'
import { createCategoryRoute } from './routes/api/grocery/category/createCategory'
import { deleteCategoryRoute } from './routes/api/grocery/category/deleteCategory'
import { getCategoriesRoute } from './routes/api/grocery/category/getCategories'
import { getCategoriesWithItems } from './routes/api/grocery/category/getCategoriesWithItems'
import { modifyCategoryRoute } from './routes/api/grocery/category/modifyCategory'
import { createGroceryItemRoute } from './routes/api/grocery/groceryItem/createGroceryItem'
import { deleteGroceryItemRoute } from './routes/api/grocery/groceryItem/deleteGroceryItem'
import { createGroupRoute } from './routes/api/grocery/group/createGroup'
import { deleteGroupRoute } from './routes/api/grocery/group/deletegroup'
import { getGroupsRoute } from './routes/api/grocery/group/getGroups'
import { authorizationSchema } from './utils/authorization'
import { globalErrorhandler } from './utils/globalErrorHandler'
import { validatedWebProcessServerVariables } from './validation/server'

const { port, host } = validatedWebProcessServerVariables

export let server: Server = Hapi.server({
  port: port,
  host: host,
  routes: {
    cors: true,
  },
})

server.auth.scheme('authenticationBySessionSchema', authorizationSchema)
server.auth.strategy('authByCookieSession', 'authenticationBySessionSchema')

export const serverInit = async () => {
  server.route([
    //Auth service routes
    loginRoute,
    identifyRoute,
    registerConfirmationRoute,
    registerRoute,
    forgotPasswordRequestRoute,
    changePasswordRequestRoute,
    //////////////////////////
    //Grocery service routes
    getGroupsRoute,
    getCategoriesWithItems,
    createCategoryRoute,
    deleteCategoryRoute,
    getCategoriesRoute,
    modifyCategoryRoute,
    createGroupRoute,
    deleteGroupRoute,
    //missing routes
    //GroceryItem routes
    createGroceryItemRoute,
    deleteGroceryItemRoute,
  ])

  server.ext({
    type: 'onPreResponse',
    method: globalErrorhandler,
  })

  await server.start()
  console.log(`ApiGateway service has been started http://${host}:${port}`)

  return server
}
console.log('Get started')
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
  console.log('Gateway service closing')

  await server.stop()
}

process.on('SIGINT', async (err) => {
  await serverStop()
  process.exit(0)
})
