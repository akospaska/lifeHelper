import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../../../utils/joi'
import { changePassword, getUserIdByEmail, isForgotPasswordTokenValid } from '../../../Databases/sql'
import { throwGlobalError } from '../../../utils/globalErrorHandler'

import { changePasswordAfterForgotPasswordRequestSchema } from '../../../validation/changePasswordAfterForgotPasswordRequest'

export const changePasswordAfterForgotPasswordRequestRoute = {
  method: 'POST',
  path: '/api/changepasswordafterforgotpasswordrequest',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    // try {
    //1. input field validation
    const { emailAddress, password, forgotPasswordToken } = Joi.attempt(
      req.payload,
      changePasswordAfterForgotPasswordRequestSchema,
      globalJoiOptions
    )

    //1 check is the email active and exists

    const accountId = await getUserIdByEmail(emailAddress)

    if (!accountId || accountId < 1) {
      throwGlobalError('Invalid email address', 403)
    }

    //2. validate is exists and not expired

    const isTokenValid = await isForgotPasswordTokenValid(forgotPasswordToken, accountId)
    if (!isTokenValid) throwGlobalError('Token is expired or not valid', 403)
    //3. change password

    const updateResult = await changePassword(accountId, password)

    if (updateResult !== 1) throwGlobalError('Error', 500)

    //4. return to the user

    return { isValid: true }
  },
}

export interface changePasswordAfterForgotPasswordRequestBody {
  emailAddress: string
  password: string
  passwordAgain: number
  forgotPasswordToken: string
}
