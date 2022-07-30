import { ResponseToolkit, Request } from 'hapi'
import { babyTrackerServiceApi } from '../../../../../api/services/babyTrackerService'
import { requestForwarder } from '../../../../../utils/requestForwarder'

export const updateChildWeightRoute = {
  method: 'POST',
  path: '/api/babytracker/childrenweight/updateweight',
  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      return requestForwarder(req, h, babyTrackerServiceApi, 'childrenweight/updateweight')
    },
  },
}
