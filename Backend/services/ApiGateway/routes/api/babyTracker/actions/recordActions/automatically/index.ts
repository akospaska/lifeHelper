import { ResponseToolkit, Request } from 'hapi'
import { babyTrackerServiceApi } from '../../../../../../api/services/babyTrackerService'

import { requestForwarder } from '../../../../../../utils/requestForwarder'

export const recordActionsAutomaticallyRoute = {
  method: 'POST',
  path: '/api/babytracker/actions/recordactions/automatically',
  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      return requestForwarder(req, h, babyTrackerServiceApi, 'actions/recordactions/automatically')
    },
  },
}
