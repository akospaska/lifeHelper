import { ResponseToolkit, Request } from 'hapi'

import { AxiosResponse } from 'axios'

import { authorizateUserRequest } from '../../../../../utils/authorization'
import { groceryServiceApi } from '../../../../../api/services/groceryService'

export const getCategoriesWithItems = {
  method: 'POST',
  path: '/api/grocery/category/getcategorieswithitems',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //const x = await authorizateUserRequest(req)

    //1. send threqe loginDetails to the auth service
    try {
      const { accountId } = await authorizateUserRequest(req.state)

      const { groupId } = req.payload as unknown as getCategoriesWithItemsRequestBody

      const validateLoginAxiosResponse: AxiosResponse = await groceryServiceApi.post(
        '/api/category/getcategorieswithitems',
        {
          accountId: accountId,
          groupId: groupId,
        }
      )

      const loginValidationResult: loginResponse = validateLoginAxiosResponse.data

      //2. set the cookie of the header

      const response = h.response(loginValidationResult).code(200)

      return response
    } catch (error) {
      console.log(error)

      const response = h.response(error.response.data).code(error.response.status)
      return response
    }
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

interface getCategoriesWithItemsRequestBody {
  groupId: number
}
