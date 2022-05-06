import { ResponseToolkit, Request } from 'hapi'

import { AxiosResponse } from 'axios'

import { authServiceApi } from '../../../../api/services/authService'

export const registerRoute = {
  method: 'POST',
  path: '/api/auth/register',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //const x = await authorizateUserRequest(req)

    //1. send threqe loginDetails to the auth service

    const validateLoginAxiosResponse: AxiosResponse = await authServiceApi.post('/api/register', req.payload)

    const registerResult = validateLoginAxiosResponse.data
    //2. set the cookie of the header

    const response = h.response(registerResult).code(200)

    return response
  },
}
