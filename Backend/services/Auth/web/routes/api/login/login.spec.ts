import { Server } from 'hapi'

import { server } from '../../../server'

import { serverInit } from '../../../server'

import { createDatabase, dropDatabase, knex, prepareDbforTests, sqlClose, sqlInit } from '../../../Databases/sql'
import { stringToSHA512 } from '../../../tools/encryption'
import { validatedWebProcessServerVariables } from '../../../validation/server'
import { closeMongDbConnection, mongoInit } from '../../../Databases/mongoDb'
import { closeRabbitMqConnection, connectRabbitMq } from '../../../rabbitMq'
import { redisClose, redisInIt } from '../../../Databases/redis'

describe('Happy Path Login Endpoint test with DB connection', () => {
  const tableName = 'account'
  const testUserName = 'testUser@gail.com'

  const testPassword = 'testPassword!'

  const testUrl = '/api/login'
  const testMethod = 'POST'

  let server

  beforeAll(async () => {
    await sqlInit()

    await mongoInit()
    await connectRabbitMq()
    await redisInIt()
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
      isConfirmed: true,
    })
  })

  afterAll(async () => {
    await knex(tableName).truncate()
    await server.stop()
    await redisClose()
    await sqlClose()
    await closeRabbitMqConnection()
    await closeMongDbConnection()
  })

  describe('Happy Path', () => {
    test('should return 200 and userInfo when called with valid credentials and sessionValue', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          email: testUserName,
          password: testPassword,
        },
      }

      const res = await server.inject(injectOptions)

      const { isValid, errorMessage, error, isAdmin, hashValue } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(200)
      expect(isValid).toEqual(true)
      expect(errorMessage).toEqual(null)
      expect(error).toEqual(null)
      // expect(isAdmin).toEqual(true)
      expect(hashValue.length === 128).toEqual(true) //sha512 hash's length is 128
    })
  })

  /*
  describe('UnHappy Path', () => {
    test('should return 400  when password less then 6 chars and username is valid in the request body', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { username: testUserName, password: 'pacal' },
      }

      const res = await serverFn.server.inject(injectOptions)
      const { isValid, error, isAdmin } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(isValid).toEqual(false)
      expect(error[0].message).toBeTruthy()
      expect(error[0].message).toContain('password')
      expect(error[0].message).toContain('length')
      expect(isAdmin).toEqual(false)
    })

    test('should return 400  when username less then 3 chars and password is valid in the request body', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { username: 'Ad', password: testPassword },
      }

      const res = await serverFn.server.inject(injectOptions)
      const { isValid, error, isAdmin } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(isValid).toEqual(false)
      expect(error[0].message).toBeTruthy()
      expect(error[0].message).toContain('username')
      expect(error[0].message).toContain('length')
      expect(isAdmin).toEqual(false)
    })

    test('should return 400 and error message when mandatory password parameter is missing', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { username: testUserName },
      }

      const res = await serverFn.server.inject(injectOptions)
      const { isValid, error, isAdmin } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(isValid).toEqual(false)
      expect(error[0].message).toBeTruthy()
      expect(error[0].message).toContain('password')
      expect(error[0].message).toContain('required')
      expect(error.length).toEqual(1)
      expect(error.length).toEqual(1)
      expect(isAdmin).toEqual(false)
    })

    test('should return 400 and error message when mandatory username parameter is missing', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { password: testPassword },
      }

      const res = await serverFn.server.inject(injectOptions)
      const { isValid, error, isAdmin } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(isValid).toEqual(false)
      expect(error[0].message).toBeTruthy()
      expect(error[0].message).toContain('username')
      expect(error[0].message).toContain('required')
      expect(error.length).toEqual(1)
      expect(isAdmin).toEqual(false)
    })

    test('should return 400 and both error messages when both mandatory parameters are missing', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {},
      }

      const res = await serverFn.server.inject(injectOptions)
      const { isValid, error, isAdmin } = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(isValid).toEqual(false)
      expect(error.length).toEqual(2)
      expect(error[0].message).toContain('username')
      expect(error[0].message).toContain('required')
      expect(error[1].message).toContain('password')
      expect(error[1].message).toContain('required')
      expect(isAdmin).toEqual(false)
    })

    test('Should return 401 when the user/password pair have not found in the DB', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {
          username: 'Admin',
          password: 'Pacasdasdal!',
        },
      }

      const res = await serverFn.server.inject(injectOptions)

      const { isValid, errorMessage, error, code } = JSON.parse(res.payload)
      expect(isValid).toEqual(false)
      expect(errorMessage).toContain('credentials')
      expect(error).toEqual(null)
      expect(res.statusCode).toEqual(401)
    })
  })*/
})
