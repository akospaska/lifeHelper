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
import { updateStatisticRoute } from './routes/api/statistics/statistics/updateStatistic/updateStatistic'
import { deleteStatisticRoute } from './routes/api/statistics/statistics/deleteStatistic/deleteStatistic'
import { recordActionManuallyRoute } from './routes/api/actions/recordActions/manually/recordActionManually'
import { updateChildRoute } from './routes/api/children/updateChild/updateChild'
import { removeChildRoute } from './routes/api/children/removeChild/removeChild'

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
    //children
    getChildrenRoute,
    updateChildRoute,
    removeChildRoute,
    //actions
    getActionStatusesRoute,
    recordActionsAutomaticallyRoute,
    stopActionsRoute,
    recordActionManuallyRoute,
    //statistics
    getStatisticsRoute,
    getStatisticTypesRoute,
    updateStatisticRoute,
    deleteStatisticRoute,
    //parentship
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
