import { ResponseToolkit, Request } from 'hapi'

import { groceryServiceApi } from '../../../../../api/services/groceryService'

import { requestForwarder } from '../../../../../utils/requestForwarder'

export const getGroupsRoute = {
  method: 'GET',
  path: '/api/grocery/group/getgroups',
  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      return requestForwarder(req, h, groceryServiceApi, 'group/getgroups')
    },
  },
}
