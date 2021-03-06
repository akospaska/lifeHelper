import { ResponseToolkit, Request } from 'hapi'

import { AxiosResponse } from 'axios'

import { authServiceApi } from '../../../../api/services/authService'

export const identifyRoute = {
  method: 'GET',
  path: '/api/auth/me',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //const x = await authorizateUserRequest(req)

    //1. send threqe loginDetails to the auth service

    const visibleCookiesOfTheRequest = req.state

    const sessionValue = visibleCookiesOfTheRequest?.lifeHelperSession

    const validateLoginAxiosResponse: AxiosResponse = await authServiceApi.post('/api/me', {
      sessionKey: sessionValue,
    })

    const loginValidationResult: loginResponse = validateLoginAxiosResponse.data

    //2. set the cookie of the header

    const response = h.response(loginValidationResult).code(200)

    console.log(loginValidationResult)
    return response
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
