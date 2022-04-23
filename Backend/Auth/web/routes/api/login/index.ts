import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { insertNewSession } from '../../Database/Redis'
import { validateLoginCredentials } from '../../Database/Sql'
import { loginRequestBody } from '../../../../interfaces/Auth/Login/index'
import { loginResponse } from '../../../../interfaces/Auth/Login/index'
import { loginRequestBodySchema } from '../../Validation/Login'

import { globalJoiOptions } from '../../../../../utils/joi'

export const loginRoute = {
  method: 'POST',
  path: '/api/login',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const { username, password } = <loginRequestBody>req.payload
    //1. input field validation
    try {
      console.log('before the validation')
      const loginInformation: loginRequestBody = Joi.attempt(req.payload, loginRequestBodySchema, globalJoiOptions)

      //2. hash the password
      const hashedPassword = encryption.stringToSHA512(password)

      //3. check data in sql
      const validationResult = await validateLoginCredentials(username, hashedPassword)
      console.log('After the sql')
      //4. create and store new session value
      const newSessionValue = encryption.generateRandomHashValue()

      const { accountId, isAdmin } = validationResult

      if (validationResult.isValid) {
        const redisSessionInsertResult: number = await insertNewSession(accountId, isAdmin, newSessionValue)
        //if the new sessionValue stroe vas success 0===unsuccess 1 === succes
        if (redisSessionInsertResult === 1) {
          const sendEmailQueueResponse = sendEmailQueue(username, accountId, isAdmin)
        }
      }

      const responseBody: loginResponse = {
        code: validationResult.isValid ? 200 : 401,
        isValid: validationResult.isValid,
        errorMessage: validationResult.isValid ? null : 'Invalid credentials',
        hashValue: validationResult.isValid ? newSessionValue : null,
        error: null,
        isAdmin: validationResult.isAdmin,
      }

      const loginResultMap = new Map()

      loginResultMap.set(true, {
        code: 200,
        isValid: true,
        errorMessage: null,
        hashValue: newSessionValue,
        error: null,
        isAdmin: validationResult.isAdmin,
      })

      loginResultMap.set(false, {
        code: 401,
        isValid: false,
        errorMessage: 'Invalid credentials',
        hashValue: null,
        error: null,
        isAdmin: false,
      })

      loginResultMap.get(false)

      const response = h.response(responseBody).code(responseBody.code)
      return response
    } catch (error) {
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
