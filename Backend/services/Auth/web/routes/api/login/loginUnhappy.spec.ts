import { serverInit } from '../../../server'

import { createDatabase, dropDatabase, knex, prepareDbforTests, sqlClose, sqlInit } from '../../../Databases/sql'
import { stringToSHA512 } from '../../../tools/encryption'
import { validatedWebProcessServerVariables } from '../../../validation/server'
import { closeMongDbConnection, mongoInit } from '../../../Databases/mongoDb'
import { closeRabbitMqConnection, connectRabbitMq } from '../../../rabbitMq'

describe('Happy Path Login Endpoint test with DB connection', () => {
  const tableName = 'account'
  const testUserName = 'TestUser@gmail.com'

  const testPassword = 'testPassword!'

  const testUrl = '/api/login'
  const testMethod = 'POST'

  let server

  beforeAll(async () => {
    await sqlInit()

    await mongoInit()
    await connectRabbitMq()
    server = await serverInit()

    await prepareDbforTests()

    await knex(tableName).truncate()

    //Insert the test record
    await knex(tableName).insert({
      email: testUserName,
      password: stringToSHA512(validatedWebProcessServerVariables.passwordSaltKey + testPassword),
      createdBy: 1,
      isAdmin: true,
      groupId: 1,
    })
  })

  afterAll(async () => {
    await knex(tableName).truncate()
    await server.stop()
    await sqlClose()
    await closeMongDbConnection()
    await closeRabbitMqConnection()
  })

  describe('Happy Path', () => {
    test('should return 400 and error details when email property is missing', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          password: testPassword,
        },
      }

      const expectedErrorDetails = [
        {
          context: { key: 'email', label: 'email' },
          message: '"email" is required',
          path: ['email'],
          type: 'any.required',
        },
      ]

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error, isAdmin, hashValue } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(isValid).toEqual(false)
      expect(errorMessage).toEqual(null)
      expect(error).toEqual(expectedErrorDetails)
      expect(hashValue).toEqual(null) //sha512 hash's length is 128
    })

    test('should return 400 and error details when password property is missing', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          email: testUserName,
        },
      }

      const expectedErrorDetails = [
        {
          message: '"password" is required',
          path: ['password'],
          type: 'any.required',
          context: { label: 'password', key: 'password' },
        },
      ]

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error, isAdmin, hashValue } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(isValid).toEqual(false)
      expect(errorMessage).toEqual(null)
      expect(error).toEqual(expectedErrorDetails)
      expect(hashValue).toEqual(null) //sha512 hash's length is 128
    })

    test('should return 400 and error details when email isnt a valid email address', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          email: 'testuserwithout@',
          password: testPassword,
        },
      }

      const expectedErrorDetails = [
        {
          message: '"email" must be a valid email',
          path: ['email'],
          type: 'string.email',
          context: { value: 'testuserwithout@', invalids: ['testuserwithout@'], label: 'email', key: 'email' },
        },
      ]

      const res = await server.inject(injectOptions)

      console.log(res.payload)

      const { isValid, errorMessage, error, isAdmin, hashValue } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(res.isAdmin).toEqual(undefined)
      expect(isValid).toEqual(false)
      expect(errorMessage).toEqual(null)
      expect(error).toEqual(expectedErrorDetails)
      expect(hashValue).toEqual(null) //sha512 hash's length is 128
    })

    test('should return 400 and error details when password is less than 3 charaacters ', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          email: testUserName,
          password: 'aa',
        },
      }

      const expectedErrorDetails = [
        {
          message: '"password" length must be at least 3 characters long',
          path: ['password'],
          type: 'string.min',
          context: { limit: 3, value: 'aa', label: 'password', key: 'password' },
        },
      ]

      const res = await server.inject(injectOptions)

      console.log(res.payload)

      const { isValid, errorMessage, error, isAdmin, hashValue } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(res.isAdmin).toEqual(undefined)
      expect(isValid).toEqual(false)
      expect(errorMessage).toEqual(null)
      expect(error).toEqual(expectedErrorDetails)
      expect(hashValue).toEqual(null) //sha512 hash's length is 128
    })
  })
})
