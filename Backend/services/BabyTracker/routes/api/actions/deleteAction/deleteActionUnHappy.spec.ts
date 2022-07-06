import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'
import { getActionById } from '../../../../dataAccessLayer/actions'

describe('Happy Path record actions automatically endpoint test test with DB connection', () => {
  const actionTableName = 'action'

  const testUrl = '/api/actions/deleteaction'
  const testMethod = 'POST'

  let server

  beforeAll(async () => {
    await sqlInit()
    server = await serverInit()
    await prepareDbForTests()
  })

  afterAll(async () => {
    await knex(actionTableName).truncate()
    await server.stop()
    await sqlClose()
  })

  describe('UnHappy Path', () => {
    beforeEach(async () => {
      await knex(actionTableName).truncate()
      await prepareDbForTests()
    })

    describe('Joi Validation Errors', () => {
      test('should return 400 and error details when the actionId is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1 },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"actionId" is required',
              path: ['actionId'],
              type: 'any.required',
              context: { label: 'actionId', key: 'actionId' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the accountId is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { actionId: 1 },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"accountId" is required',
              path: ['accountId'],
              type: 'any.required',
              context: { label: 'accountId', key: 'accountId' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the request body is an empty object', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {},
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"accountId" is required',
              path: ['accountId'],
              type: 'any.required',
              context: { label: 'accountId', key: 'accountId' },
            },
            {
              message: '"actionId" is required',
              path: ['actionId'],
              type: 'any.required',
              context: { label: 'actionId', key: 'actionId' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the request body is null', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: null,
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"value" must be of type object',
              path: [],
              type: 'object.base',
              context: { type: 'object', label: 'value', value: null },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when accountId"s value is not a number', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 'number', actionId: 1 },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"accountId" must be a number',
              path: ['accountId'],
              type: 'number.base',
              context: { label: 'accountId', value: 'number', key: 'accountId' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)
        console.log(res.payload)
        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when actionId"s value is not a number', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, actionId: 'number' },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"actionId" must be a number',
              path: ['actionId'],
              type: 'number.base',
              context: { label: 'actionId', value: 'number', key: 'actionId' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)
        console.log(res.payload)
        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })
    })
    describe('Against the business logic errors', () => {
      test('should return 403 and error details when the actionId is not belongs to the actionId', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 2, actionId: 1 },
        }

        const expectedResponse = { code: 403, isValid: false, errorMessage: 'Access Denied!' }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)
        console.log(res.payload)
        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 403 and error details when the actionId is not exists', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, actionId: 11111 },
        }

        const expectedResponse = { code: 403, isValid: false, errorMessage: 'Access Denied!' }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)
        console.log(res.payload)
        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })
    })
  })
})
