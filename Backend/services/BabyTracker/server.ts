import * as Hapi from '@hapi/hapi'

import { Server } from 'hapi'

import { globalErrorhandler } from './utils/errorHandling'
import { validatedServerVariables } from './validation/server'

import { sqlInit } from './databases/sql'

const { host, port } = validatedServerVariables

import { ResponseToolkit, Request } from 'hapi'
import { getChildrenRoute } from './routes/api/children/getChildren'
import { getActionStatusesRoute } from './routes/api/actions/getActionStatuses/getActionStatuses'
import { recordActionsAutomaticallyRoute } from './routes/api/actions/recordActions/automatically/recordActionsAutomatically'
import { stopActionsRoute } from './routes/api/actions/stopActions/stopActionsRoute'
import { getStatisticsRoute } from './routes/api/statistics/statistics/getStatisitcs/getStatistics'
import { getStatisticTypesRoute } from './routes/api/statistics/statistics/getStatisticTypes/getStatisticTypes'

import { recordActionManuallyRoute } from './routes/api/actions/recordActions/manually/recordActionManually'
import { updateChildRoute } from './routes/api/children/updateChild/updateChild'
import { removeChildRoute } from './routes/api/children/removeChild/removeChild'
import { deleteActionRoute } from './routes/api/actions/deleteAction/deleteAction'
import { updateActionRoute } from './routes/api/actions/updateAction/updateAction'
import { checkParentShipStatusRoute } from './routes/api/parentship/checkParentShipStatus/checkParentShip'
import { checkParentInvitationsRoute } from './routes/api/parentship/checInvitations/checkInvitations'
import { acceptParentInvitationRoute } from './routes/api/parentship/acceptInvitation/acceptInvitations'
import { registerChildRoute } from './routes/api/children/registerChild/registerChild'
import { declineInvitationRoute } from './routes/api/parentship/declineInvitation/declineInvitation'
import { inviteToParentShipRoute } from './routes/api/parentship/invite/invite'
import { divorceParentShipRoute } from './routes/api/parentship/divorce/divorce'
import { getChildWeights, insertChildWeight } from './facade/childWeight'
import { getChildWeightsRoute } from './routes/api/childWeight/getWeights'
import { insertChildWeightRoute } from './routes/api/childWeight/insertNewWeight'
import { updateChildWeightRoute } from './routes/api/childWeight/updateWeight'
import { deleteChildWeightsRoute } from './routes/api/childWeight/deleteWeight'

export let server: Server = Hapi.server({
  port: port,
  host: host,
  routes: {
    cors: true,
  },
})

export const serverInit = async () => {
  server.route([
    //children
    getChildrenRoute,
    updateChildRoute,
    removeChildRoute,
    registerChildRoute,
    //actions
    getActionStatusesRoute,
    recordActionsAutomaticallyRoute,
    stopActionsRoute,
    recordActionManuallyRoute,
    deleteActionRoute,
    updateActionRoute,
    //statistics
    getStatisticsRoute,
    getStatisticTypesRoute,
    //parentship
    checkParentShipStatusRoute,
    checkParentInvitationsRoute,
    acceptParentInvitationRoute,
    inviteToParentShipRoute,
    declineInvitationRoute,
    divorceParentShipRoute,
    //childWeights
    getChildWeightsRoute,
    insertChildWeightRoute,
    updateChildWeightRoute,
    deleteChildWeightsRoute,
  ])

  server.ext('onPreResponse', globalErrorhandler)

  await server.start()

  return server
}

export const serverStart = async () => {
  try {
    await sqlInit()
    await serverInit()

    // if (process.env.NODE_ENV === 'tst') await prepareDbForTests()

    console.log(`BabyTracker Service has been started on port:${port}`)

    return server
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

export const serverStop = async () => {
  console.log('BabyTracker service closing')

  await server.stop()
}

process.on('SIGINT', async (err) => {
  await serverStop()
  process.exit(0)
})
