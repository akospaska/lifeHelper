///////////////////////////
import { ResponseToolkit, Request } from 'hapi'

import { AxiosResponse } from 'axios'

import { authorizateUserRequest } from '../../../../../utils/authorization'
import { groceryServiceApi } from '../../../../../api/services/groceryService'

export const getGroupsRoute = {
  method: 'GET',
  path: '/api/grocery/group/getgroups',
  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      //const x = await authorizateUserRequest(req)

      //1. send threqe loginDetails to the auth service
      try {
        //accountId after the autherization
        const accountId = req.auth.credentials['accountId']

        const validateLoginAxiosResponse: AxiosResponse = await groceryServiceApi.post('/api/group/getgroups', {
          accountId: accountId,
        })

        const loginValidationResult: loginResponse = validateLoginAxiosResponse.data

        //2. set the cookie of the header

        const response = h.response(loginValidationResult).code(200)

        return response
      } catch (error) {
        const response = h.response(error.response.data).code(error.response.status)
        return response
      }
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
