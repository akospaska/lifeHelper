import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { validateLoginCredentials } from '../../../Databases/sql'

import { loginRequestBodySchema } from '../../../validation/login'
import { loginResponse } from '../../../../interfaces/Auth/Login/index'

import { loginRequestBody } from '../../../../interfaces/Auth/Login/index'
import { globalJoiOptions } from '../../../../../../utils/joi'

import { generateRandomHashValue, stringToSHA512 } from '../../../tools/encryption'
import { validatedWebProcessServerVariables } from '../../../validation/server'
import { insertNewSessionDetails, test } from '../../../Databases/mongoDb'

export const loginRoute = {
  method: 'POST',
  path: '/api/login',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const { email, password } = <loginRequestBody>req.payload

    try {
      //1. input field validation
      Joi.attempt(req.payload, loginRequestBodySchema, globalJoiOptions)

      const { passwordSaltKey } = validatedWebProcessServerVariables

      //2. hash the password
      const hashedPassword = stringToSHA512(passwordSaltKey + password)

      //3. check data in sql
      const validationResult = await validateLoginCredentials(email, hashedPassword)

      //4. create and store new session value

      let newSessionValue

      if (validationResult.isValid) {
        const newSessionDetail = {
          accountId: validationResult.accountId,
          isAdmin: validationResult.isAdmin,
          groupId: validationResult.groupId,
        }

        newSessionValue = await insertNewSessionDetails(newSessionDetail)
      }

      const responseBody: loginResponse = {
        // code: validationResult.isValid ? 200 : 401,
        accesGranted: validationResult.isValid,
        errorMessage: validationResult.isValid ? null : 'Invalid credentials',
        hashValue: validationResult.isValid ? newSessionValue : null,
        error: null,
        isAdmin: validationResult.isAdmin,
        groupId: 1,
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

      let loginResult

      loginResult = responseBody.accesGranted ? loginResultMap.get(true) : loginResultMap.get(false)

      const response = h.response(loginResult).code(loginResult.code)

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