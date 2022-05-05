import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../../../utils/joi'
import { getUserIdByEmail, insertNewForgotPasswordToken } from '../../../Databases/sql'
import { forgotPasswordRequestRequestBodySchema } from '../../../validation/forgotPasswordRequest'
import { throwGlobalError } from '../../../utils/globalErrorHandler'
import { sendForgotRequestQueue } from '../../../rabbitMq/queue/forgotPasswordRequest'
import { generateRandomHashValue } from '../../../tools/encryption'

export const forgotPasswordRequestRoute = {
  method: 'POST',
  path: '/api/forgotpasswordrequest',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    // try {
    //1. input field validation
    const { email } = Joi.attempt(req.payload, forgotPasswordRequestRequestBodySchema, globalJoiOptions)

    //1 check is the email active and exists

    const accountId = await getUserIdByEmail(email)

    if (!accountId || accountId < 1) {
      throwGlobalError('Invalid email address', 403)
    }

    const newForgotPasswordToken = generateRandomHashValue()
    //2. insert a forgotPasswordRequestToken

    const insertResult = await insertNewForgotPasswordToken(accountId, newForgotPasswordToken)

    if (!insertResult || insertResult < 1) throwGlobalError('Database Error', 403)

    //3. send message to the queue for e-mail sending

    const messageBody = {
      emailTopic: 'Forgot Password Request',
      emailAddress: email,
      accountId: accountId,
      forgotPasswordToken: newForgotPasswordToken,
    }

    sendForgotRequestQueue(messageBody)

    //4. return to the user

    return { isValid: true }
  },
}

export interface forgotPasswordRequestRequestBody {
  email: string
}

export interface forgotPasswordMessageBody {
  emailTopic: string
  emailAddress: string
  accountId: number
  forgotPasswordToken: string
}
