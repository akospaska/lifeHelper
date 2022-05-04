import { ResponseToolkit, Request } from 'hapi'

import { AxiosResponse } from 'axios'

import { authServiceApi } from '../../../../api/services/authService'

export const loginRoute = {
  method: 'POST',
  path: '/api/auth/login',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const loginRequestBody = req.payload as unknown as loginRequestBody

    //1. send the loginDetails to the auth service

    const validateLoginAxiosResponse: AxiosResponse = await authServiceApi.post('/api/login', loginRequestBody)

    const loginValidationResult: loginResponse = validateLoginAxiosResponse.data

    //2. set the cookie of the header

    const response = h.response(loginValidationResult).code(validateLoginAxiosResponse.status)
    response.state('lifeHelperSession', loginValidationResult.hashValue, {
      isHttpOnly: false,
      isSecure: true,
      isSameSite: 'Lax',
    })
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
