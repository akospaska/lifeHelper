import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../../../utils/joi'
import { registerConfirmationSchema } from '../../../validation/registerConfirmation'
import { validateRegisterAccountToken } from '../../../Databases/sql'

export const registerconfirmationRoute = {
  method: 'POST',
  path: '/api/registerconfirmation',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    // try {
    //1. input field validation
    const { token } = Joi.attempt(req.payload, registerConfirmationSchema, globalJoiOptions)

    //check the token value and validate it

    const isValidationWasSuccess = await validateRegisterAccountToken(token)

    if (!isValidationWasSuccess) {
      const errorObject = new Error('Token is expired')
      errorObject['code'] = 403
      throw errorObject
    }

    return isValidationWasSuccess
  },
}

export interface registerConfirmationRequestBody {
  token: string
}
