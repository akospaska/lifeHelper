import { ResponseToolkit, Request } from 'hapi'

import { AxiosResponse } from 'axios'

import { authServiceApi } from '../../../../api/services/authService'

export const registerConfirmationRoute = {
  method: 'GET',
  path: '/api/auth/registerconfirmation',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //const x = await authorizateUserRequest(req)

    //1. send threqe loginDetails to the auth service

    const confirmationToken = req?.query?.token

    const validateLoginAxiosResponse: AxiosResponse = await authServiceApi.post('/api/registerconfirmation', {
      token: confirmationToken,
    })

    const loginValidationResult = validateLoginAxiosResponse.data

    //2. set the cookie of the header

    const response = h.response(loginValidationResult).code(200)

    return response
  },
}
