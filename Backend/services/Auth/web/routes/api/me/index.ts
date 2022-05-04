import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../../../utils/joi'
import { identifyRequestBodySchema } from '../../../validation/me'
import { getSessiondetails } from '../../../Databases/mongoDb'

export const identifyUserRoute = {
  method: 'POST',
  path: '/api/me',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    // try {
    const { sessionKey } = <identifyRequestBody>Joi.attempt(req.payload, identifyRequestBodySchema, globalJoiOptions)

    const sessionDetails = await getSessiondetails(sessionKey)

    if (!sessionDetails) {
      const errorObject = new Error('session not found')

      errorObject['code'] = 403
      throw errorObject
    }

    //remove the nonsecure mongoDbId from the response body
    delete sessionDetails['_id']

    const response = h.response(sessionDetails).code(200)

    return response
  },
}

export interface identifyRequestBody {
  sessionKey: string
}
