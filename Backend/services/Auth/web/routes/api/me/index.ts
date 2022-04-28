import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { loginRequestBodySchema } from '../../../validation/login'

import { globalJoiOptions } from '../../../../../../utils/joi'
import { identifyRequestBodySchema } from '../../../validation/me'
import { getSessiondetails } from '../../../Databases/mongoDb'
import { throws } from 'assert'

export const identifyUserRoute = {
  method: 'POST',
  path: '/api/me',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    try {
      const { sessionKey } = <identifyRequestBody>Joi.attempt(req.payload, identifyRequestBodySchema, globalJoiOptions)

      const sessionDetails = await getSessiondetails(sessionKey)

      console.log(sessionDetails)

      if (!sessionDetails) {
        throw new Error('session not found')
      }

      const response = h.response(sessionDetails).code(200)

      return response
    } catch (error) {
      console.log(error)
      const databaseError = error?.code === 500 || error.message.includes('connect') ? true : false
      const responseBody = {
        code: databaseError ? 500 : 400,
        isValid: false,
        errorMessage: databaseError ? 'Database Connection Error' : null,
        hashValue: null,
        error: error.details,
        isAdmin: false,
      }

      const response = h.response(responseBody).code(responseBody.code)
      return response
    }
  },
}

export interface identifyRequestBody {
  sessionKey: string
}
