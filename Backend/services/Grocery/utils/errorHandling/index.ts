import Joi from 'joi'

export const handleError = (error) => {
  console.log(error)
  const isJoiError = Joi.isError(error)

  const errorResponseBody: errorResponseBody = {
    code: isJoiError ? 400 : 500,
    errorMessage: isJoiError ? 'Request body validation error' : 'Fatal error',
    error: error.details,
  }

  return errorResponseBody
}

export interface errorResponseBody {
  code: number
  errorMessage: string
  error: joiErrorDetail[]
}

interface joiErrorDetail {
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

import * as Hapi from '@hapi/hapi'

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
    errorMessage: response.message ? response.message : 'Fatal error',
    hashValue: null,
    error: null,
    isAdmin: false,
  })

  let errorResponseBody

  if (Joi.isError(response)) errorResponseBody = errorResponseMap.get(400)
  else if (response.code === 403) errorResponseBody = errorResponseMap.get(response.code)
  else if (response.code === 401) errorResponseBody = errorResponseMap.get(response.code)
  else errorResponseBody = errorResponseMap.get(500)

  return h.response(errorResponseBody).code(errorResponseBody.code)
}

export const throwGlobalError = (errorMessage: string, errorCode: number, errorDetails: any = null) => {
  const errorObject = new Error(errorMessage)

  errorObject['code'] = errorCode

  errorObject['error'] = errorDetails

  throw errorObject
}
