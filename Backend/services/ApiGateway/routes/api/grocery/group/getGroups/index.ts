///////////////////////////
import { ResponseToolkit, Request } from 'hapi'

import { AxiosResponse } from 'axios'

import { groceryServiceApi } from '../../../../../api/services/groceryService'

export const getGroupsRoute = {
  method: 'GET',
  path: '/api/grocery/group/getgroups',
  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      //1. send threqe loginDetails to the auth service

      //accountId after the autherization

      if (req.auth.credentials['code'] !== 200 && typeof req.auth.credentials['code'] === 'number') {
        return h.response(req.auth.credentials).code(req.auth.credentials['code'])
      }

      const accountId = req.auth.credentials['accountId']

      const validateLoginAxiosResponse: AxiosResponse = await groceryServiceApi.post('/api/group/getgroups', {
        accountId: accountId,
      })

      const loginValidationResult: loginResponse = validateLoginAxiosResponse.data

      //2. set the cookie of the header

      const response = h.response(loginValidationResult).code(200)

      return response
    },
  },
}

export interface loginResponse {
  isValid: boolean
  isAdmin: boolean
  message: null | string
  code: number
  error: joiErrorDetail[]
  hashValue: string
  groupId: number
}

export interface joiErrorDetail {
  message: string
  path: string[]
  type: string
  context: [joiErrorDetailContext]
}

interface joiErrorDetailContext {
  limit: number
  value: string
  label: string
  key: string
}
