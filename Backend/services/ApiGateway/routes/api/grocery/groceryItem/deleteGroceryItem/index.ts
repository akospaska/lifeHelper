import { ResponseToolkit, Request } from 'hapi'

import { groceryServiceApi } from '../../../../../api/services/groceryService'

import { requestForwarder } from '../../../../../utils/requestForwarder'

export const deleteGroceryItemRoute = {
  method: 'POST',
  path: '/api/grocery/groceryitem/deletegroceryitem',
  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      return requestForwarder(req, h, groceryServiceApi, 'groceryitem/deletegroceryitem')
    },
  },
}
