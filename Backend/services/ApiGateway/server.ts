import * as Hapi from '@hapi/hapi'
import axios from 'axios'

import { Server } from 'hapi'
import { changePasswordRequestRoute } from './routes/api/auth/changePasswordAfterForgotPasswordRequest'
import { forgotPasswordRequestRoute } from './routes/api/auth/forgotPasswordRequest'

import { loginRoute } from './routes/api/auth/login'
import { identifyRoute } from './routes/api/auth/me'
import { registerRoute } from './routes/api/auth/register'
import { registerConfirmationRoute } from './routes/api/auth/registerConfirmation'
import { deleteActionRoute } from './routes/api/babyTracker/actions/deleteAction'
import { getActionStatusesRoute } from './routes/api/babyTracker/actions/getActionStatuses'
import { recordActionsAutomaticallyRoute } from './routes/api/babyTracker/actions/recordActions/automatically'
import { recordActionManuallyRoute } from './routes/api/babyTracker/actions/recordActions/manually'
import { stopActionsRoute } from './routes/api/babyTracker/actions/stopActions'
import { updateActionRoute } from './routes/api/babyTracker/actions/updateAction'
import { getChildrenRoutes } from './routes/api/babyTracker/children/getChildren'
import { removeChildRoute } from './routes/api/babyTracker/children/removeChild'
import { updateChildRoute } from './routes/api/babyTracker/children/updateChild'
import { getStatisticsRoute } from './routes/api/babyTracker/statistics/statistics/getstatistics'
import { getStatisticTypesRoute } from './routes/api/babyTracker/statistics/statistics/getstatistictypes'
import { createCategoryRoute } from './routes/api/grocery/category/createCategory'
import { deleteCategoryRoute } from './routes/api/grocery/category/deleteCategory'
import { getCategoriesRoute } from './routes/api/grocery/category/getCategories'
import { getCategoriesWithItems } from './routes/api/grocery/category/getCategoriesWithItems'
import { getIconsRoute } from './routes/api/grocery/category/getIcons'
import { modifyCategoryRoute } from './routes/api/grocery/category/modifyCategory'
import { createGroceryItemRoute } from './routes/api/grocery/groceryItem/createGroceryItem'
import { deleteGroceryItemRoute } from './routes/api/grocery/groceryItem/deleteGroceryItem'
import { createGroupRoute } from './routes/api/grocery/group/createGroup'
import { deleteGroupRoute } from './routes/api/grocery/group/deletegroup'
import { getGroupsRoute } from './routes/api/grocery/group/getGroups'
import { declineInvitationRoute } from './routes/api/babyTracker/parentship/declineinvitation'
import { divorceRoute } from './routes/api/babyTracker/parentship/divorce'
import { authorizationSchema } from './utils/authorization'
import { globalErrorhandler } from './utils/globalErrorHandler'
import { validatedWebProcessServerVariables } from './validation/server'
import { inviteParentShipRoute } from './routes/api/babyTracker/parentship/invite/invite'
import { checkParentShipStatusRoute } from './routes/api/babyTracker/parentship/checkParentShipStatus'

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
    {
      method: 'GET',
      path: '/',
      handler: async function (request, reply) {
        console.log('I am in')
        const randomNumber = Math.floor(Math.random() * 10) + 1

        return { message: 'I am still alive', time: new Date() }
      },
    },
    //Auth service routes
    loginRoute,
    identifyRoute,
    registerConfirmationRoute,
    registerRoute,
    forgotPasswordRequestRoute,
    changePasswordRequestRoute,
    //////////////////////////
    //Grocery service routes
    getIconsRoute,
    getGroupsRoute,
    getCategoriesWithItems,
    createCategoryRoute,
    deleteCategoryRoute,
    getCategoriesRoute,
    modifyCategoryRoute,
    createGroupRoute,
    deleteGroupRoute,

    //GroceryItem routes
    createGroceryItemRoute,
    deleteGroceryItemRoute,

    //BabyTracker routes

    getChildrenRoutes,
    removeChildRoute,
    updateChildRoute,

    stopActionsRoute,
    recordActionsAutomaticallyRoute,
    recordActionManuallyRoute,
    getActionStatusesRoute,
    updateActionRoute,
    deleteActionRoute,

    getStatisticTypesRoute,
    getStatisticsRoute,

    inviteParentShipRoute,
    divorceRoute,
    declineInvitationRoute,
    checkParentShipStatusRoute,
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
