import { ResponseToolkit, Request } from 'hapi'

import { AxiosResponse } from 'axios'

import { authServiceApi } from '../../../../api/services/authService'

export const forgotPasswordRequestRoute = {
  method: 'POST',
  path: '/api/auth/forgotpasswordrequest',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. send threqe loginDetails to the auth service

    const validateLoginAxiosResponse: AxiosResponse = await authServiceApi.post(
      '/api/forgotpasswordrequest',
      req.payload
    )

    const registerResult = validateLoginAxiosResponse.data
    //2. set the cookie of the header

    const response = h.response(registerResult).code(200)

    return response
  },
}
