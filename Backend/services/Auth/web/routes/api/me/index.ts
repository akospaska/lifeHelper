import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../utils/joi'
import { identifyRequestBodySchema } from '../../../validation/me'

import { getSessionDetails } from '../../../Databases/redis'

export const identifyUserRoute = {
  method: 'POST',
  path: '/api/me',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const { sessionKey } = <identifyRequestBody>Joi.attempt(req.payload, identifyRequestBodySchema, globalJoiOptions)

    const sessionDetails = await getSessionDetails(sessionKey)

    const response = h.response(sessionDetails).code(200)

    return response
  },
}

export interface identifyRequestBody {
  sessionKey: string
}
