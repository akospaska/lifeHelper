import { ResponseToolkit, Request } from 'hapi'

import { AxiosResponse } from 'axios'

import { Boom } from '@hapi/boom'

import { groceryServiceApi } from '../../../../../api/services/groceryService'
import { type } from 'os'

export const getCategoriesWithItems = {
  method: 'POST',
  path: '/api/grocery/category/getcategorieswithitems',
  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      //1. send threqe loginDetails to the auth service

      if (req.auth.credentials['code'] !== 200 && typeof req.auth.credentials['code'] === 'number') {
        return h.response(req.auth.credentials).code(req.auth.credentials['code'])
      }

      const accountId = req.auth.credentials['accountId']

      const { groupId } = req.payload as unknown as getCategoriesWithItemsRequestBody

      const validateLoginAxiosResponse: AxiosResponse = await groceryServiceApi.post(
        '/api/category/getcategorieswithitems',
        {
          accountId: accountId,
          groupId: groupId,
        }
      )

      const loginValidationResult = validateLoginAxiosResponse.data

      const response = h.response(loginValidationResult).code(200)

      return response
    },
  },
}

interface getCategoriesWithItemsRequestBody {
  groupId: number
}
