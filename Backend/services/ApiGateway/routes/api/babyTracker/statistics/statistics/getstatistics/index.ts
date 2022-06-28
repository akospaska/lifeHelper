import { ResponseToolkit, Request } from 'hapi'
import { babyTrackerServiceApi } from '../../../../../../api/services/babyTrackerService'

import { requestForwarder } from '../../../../../../utils/requestForwarder'

export const getStatisticsRoute = {
  method: 'POST',
  path: '/api/babytracker/statistics/statistics/getstatistics',
  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      return requestForwarder(req, h, babyTrackerServiceApi, 'statistics/statistics/getstatistics')
    },
  },
}
