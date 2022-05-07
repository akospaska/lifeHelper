import * as Hapi from '@hapi/hapi'
import Joi from 'joi'

export const globalErrorhandler = (request: Hapi.Request, h) => {
  const response = request.response

  if (!response.isBoom) {
    // if not error then continue :)
    return h.continue
  }

  let errorResponseMap = new Map()

  console.log(response)

  errorResponseMap.set(418, {
    code: 403,
    isValid: false,
    errorMessage: 'Session not found',
    hashValue: null,
    error: null,
    isAdmin: false,
  })

  errorResponseMap.set(500, {
    code: 500,
    isValid: false,
    errorMessage: response.message,
    hashValue: null,
    error: null,
    isAdmin: false,
  })

  let errorResponseBody
  //if the response object contains a handled error response send towards that.
  if (response?.response?.data) errorResponseBody = response.response.data
  else errorResponseBody = errorResponseMap.get(500)

  return h.response(errorResponseBody).code(errorResponseBody.code)
}
