import { ResponseToolkit, Request } from 'hapi'

import { AxiosResponse } from 'axios'

export const requestForwarder = async (
  req: Request,
  h: ResponseToolkit,
  preparedAxiosServiceEndpoint,
  apiendpointUrl: string
) => {
  //1. send threqe loginDetails to the auth service

  if (req.auth.credentials['code'] !== 200 && typeof req.auth.credentials['code'] === 'number') {
    return h.response(req.auth.credentials).code(req.auth.credentials['code'])
  }

  const accountId = req.auth.credentials['accountId']

  const requestBody = req.payload ? req.payload : {}
  requestBody['accountId'] = accountId

  const validateLoginAxiosResponse: AxiosResponse = await preparedAxiosServiceEndpoint.post(
    `/api/${apiendpointUrl}`,
    requestBody
  )

  const loginValidationResult = validateLoginAxiosResponse.data

  const response = h.response(loginValidationResult).code(200)
  return response
}
