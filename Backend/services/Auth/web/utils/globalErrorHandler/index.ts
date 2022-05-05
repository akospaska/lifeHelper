import * as Hapi from '@hapi/hapi'
import Joi from 'joi'

export const globalErrorhandler = (request: Hapi.Request, h) => {
  const response = request.response

  if (!response.isBoom) {
    // if not error then continue :)
    return h.continue
  }

  let errorResponseMap = new Map()

  errorResponseMap.set(401, {
    code: 401,
    isValid: false,
    errorMessage: response.message,
    hashValue: null,
    error: null,
    isAdmin: false,
  })

  errorResponseMap.set(403, {
    code: 403,
    isValid: false,
    errorMessage: response.message,
    hashValue: null,
    error: null,
    isAdmin: false,
  })

  errorResponseMap.set(400, {
    code: 400,
    isValid: false,
    errorMessage: 'RequestBody Validation Failed',
    hashValue: null,
    error: response['details'],
    isAdmin: false,
  })

  errorResponseMap.set(500, {
    code: 500,
    isValid: false,
    errorMessage: 'Fatal error YOLO',
    hashValue: null,
    error: null,
    isAdmin: false,
  })

  let errorResponseBody

  if (Joi.isError(response)) errorResponseBody = errorResponseMap.get(400)
  else if (response.code === 403) errorResponseBody = errorResponseMap.get(response.code)
  else if (response.code === 401) errorResponseBody = errorResponseMap.get(response.code)
  else errorResponseBody = errorResponseMap.get(500)

  console.log('i am the eerrorresponsebody')

  console.log(errorResponseBody)

  return h.response(errorResponseBody).code(errorResponseBody.code)
}

export const throwGlobalError = (errorMessage: string, errorCode: number, errorDetails: any = null) => {
  const errorObject = new Error(errorMessage)

  errorObject['code'] = errorCode

  errorObject['error'] = errorDetails

  throw errorObject
}
