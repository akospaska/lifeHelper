import Joi from 'joi'

export const handleError = (error) => {
  console.log(Joi.isError(error))

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
