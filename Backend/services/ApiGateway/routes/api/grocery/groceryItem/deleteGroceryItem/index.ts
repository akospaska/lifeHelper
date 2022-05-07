import { ResponseToolkit, Request } from 'hapi'

import { AxiosResponse } from 'axios'

import { groceryServiceApi } from '../../../../../api/services/groceryService'

export const deleteGroceryItemRoute = {
  method: 'POST',
  path: '/api/grocery/groceryitem/deletegroceryitem',

  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      const loginRequestBody = req.payload as unknown as loginRequestBody

      if (req.auth.credentials['code'] !== 200 && typeof req.auth.credentials['code'] === 'number') {
        return h.response(req.auth.credentials).code(req.auth.credentials['code'])
      }

      const accountId = req.auth.credentials['accountId']

      loginRequestBody['accountId'] = accountId

      const validateLoginAxiosResponse: AxiosResponse = await groceryServiceApi.post(
        '/api/groceryitem/deletegroceryitem',
        loginRequestBody
      )

      const loginValidationResult: loginResponse = validateLoginAxiosResponse.data

      //2. set the cookie of the header

      const response = h.response(loginValidationResult).code(200)

      return response
    },
  },
}

interface loginRequestBody {
  email: string
  password: string
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
