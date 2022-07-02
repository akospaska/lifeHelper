import { ResponseToolkit, Request } from 'hapi'
import { babyTrackerServiceApi } from '../../../../../api/services/babyTrackerService'

import { requestForwarder } from '../../../../../utils/requestForwarder'

export const updateChildRoute = {
  method: 'POST',
  path: '/api/babytracker/children/updatechild',
  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      console.log('I am at the beginning')
      return requestForwarder(req, h, babyTrackerServiceApi, 'children/updatechild')
    },
  },
}
