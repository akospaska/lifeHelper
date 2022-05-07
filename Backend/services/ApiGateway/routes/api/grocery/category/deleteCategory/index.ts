import { ResponseToolkit, Request } from 'hapi'

import { AxiosResponse } from 'axios'

import { groceryServiceApi } from '../../../../../api/services/groceryService'

export const deleteCategoryRoute = {
  method: 'POST',
  path: '/api/grocery/category/deletecategory',

  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      const loginRequestBody = req.payload

      if (req.auth.credentials['code'] !== 200 && typeof req.auth.credentials['code'] === 'number') {
        return h.response(req.auth.credentials).code(req.auth.credentials['code'])
      }

      const accountId = req.auth.credentials['accountId']

      loginRequestBody['accountId'] = accountId

      const apiResponse: AxiosResponse = await groceryServiceApi.post('/api/category/deletecategory', loginRequestBody)

      const loginValidationResult = apiResponse.data

      const response = h.response(loginValidationResult).code(200)

      return response
    },
  },
}
