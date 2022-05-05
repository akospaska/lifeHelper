import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../../../utils/joi'

import { generateRandomHashValue } from '../../../tools/encryption'
import { registerAccountValidationSchema } from '../../../validation/register'
import {
  insertNewConfirmationToken,
  isTheAccountAdmin,
  isTheEmailAlreadyRegistered,
  registerNewAccountAndGetId,
} from '../../../Databases/sql'
import { registerAttemptMessageBody, sendRegisterAttemptQueue } from '../../../rabbitMq/queue/registerAttempt'
import { throwGlobalError } from '../../../utils/globalErrorHandler'
import { Console } from 'console'

export const registerRoute = {
  method: 'POST',
  path: '/api/register',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    // try {
    //1. input field validation
    const { emailAddress, password, creatorAccountId, isAdmin } = Joi.attempt(
      req.payload,
      registerAccountValidationSchema,
      globalJoiOptions
    )

    //1. search is the account already exists
    const isTheAccountAlreadyRegistered = await isTheEmailAlreadyRegistered(emailAddress)

    if (isTheAccountAlreadyRegistered) {
      throwGlobalError('Account already registered', 403)
    }

    if (isAdmin) {
      console.log('I AM INT THE ADMIIIINNN')
      const isTheCreatorHasRight = await isTheAccountAdmin(creatorAccountId)
      if (!isTheCreatorHasRight) {
        throwGlobalError('Permission denied!', 403)
      }
    }

    //check the acces is the creator an admin or not

    //2. register into the sql
    const newAccountId = await registerNewAccountAndGetId(emailAddress, password, isAdmin, creatorAccountId)

    //3insert into the new confirmationToken table the new session value

    const newConfirmationToken = generateRandomHashValue()

    await insertNewConfirmationToken(newAccountId, newConfirmationToken)

    //4. send email about it to the queue

    const messageToQueue: registerAttemptMessageBody = {
      emailAddress: emailAddress,
      accountId: newAccountId,
      groupId: 0,
      isAdmin: isAdmin,
      confirmationToken: newConfirmationToken,
    }

    sendRegisterAttemptQueue(messageToQueue)

    //5. send back to the response

    return { isValid: true }
  },
}

export interface registerAccountRequestBody {
  emailAddress: string
  password: string
  passwordAgain: string
  creatorAccountId: number
  isAdmin: boolean
}
