import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../../../utils/joi'
import { identifyRequestBodySchema } from '../../../validation/me'
import { getSessiondetails } from '../../../Databases/mongoDb'

export const identifyUserRoute = {
  method: 'POST',
  path: '/api/me',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    try {
      const { sessionKey } = <identifyRequestBody>Joi.attempt(req.payload, identifyRequestBodySchema, globalJoiOptions)

      const sessionDetails = await getSessiondetails(sessionKey)

      if (!sessionDetails) {
        throw new Error('session not found')
      }

      const response = h.response(sessionDetails).code(200)

      return response
    } catch (error) {
      console.log(error)

      //////////////

      const errorResponseMap = new Map()

      errorResponseMap.set(400, {
        error: error.details,
        code: 400,
        errorMessage: 'RequestBody Validation Failed',
      })

      errorResponseMap.set(418, {
        code: 418,
        errorMessage: 'Session not found',
      })

      errorResponseMap.set(500, {
        code: 500,
        errorMessage: 'Fatal error',
      })

      let errorResponseBody

      if (error.details) errorResponseBody = errorResponseMap.get(400)
      else if (error.message === 'session not found') errorResponseBody = errorResponseMap.get(418)
      else errorResponseBody = errorResponseMap.get(500)

      const response = h.response(errorResponseBody).code(errorResponseBody.code)
      return response
    }
  },
}

export interface identifyRequestBody {
  sessionKey: string
}
