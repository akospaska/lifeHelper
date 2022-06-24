import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('Happy Path Login Endpoint test with DB connection', () => {
  const childTableName = 'child'

  const testUrl = '/api/children/getchildren'
  const testMethod = 'POST'

  let server

  beforeAll(async () => {
    await sqlInit()

    server = await serverInit()

    await prepareDbForTests()
  })

  afterAll(async () => {
    await knex(childTableName).truncate()
    await server.stop()
    await sqlClose()
  })

  describe('Happy Path', () => {
    test('should return 400 and error details when the payload contains invalid propertys', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { invalidAccountIdFormat: 1 },
      }

      const expectedError = [
        {
          message: '"accountId" is required',
          path: ['accountId'],
          type: 'any.required',
          context: { label: 'accountId', key: 'accountId' },
        },
        {
          message: '"invalidAccountIdFormat" is not allowed',
          path: ['invalidAccountIdFormat'],
          type: 'object.unknown',
          context: {
            child: 'invalidAccountIdFormat',
            label: 'invalidAccountIdFormat',
            value: 1,
            key: 'invalidAccountIdFormat',
          },
        },
      ]

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      const { error } = responseBody

      expect(res.statusCode).toEqual(400)
      expect(error).toEqual(expectedError)
    })

    test('should return 400 when the response body is only an empty object', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: {},
      }

      const expectedError = [
        {
          message: '"accountId" is required',
          path: ['accountId'],
          type: 'any.required',
          context: { label: 'accountId', key: 'accountId' },
        },
      ]

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      const { error } = responseBody

      expect(res.statusCode).toEqual(400)
      expect(error).toEqual(expectedError)
    })

    test('should return 400 when the request body"s accountId is a string', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 'string' },
      }

      const expectedError = [
        {
          message: '"accountId" must be a number',
          path: ['accountId'],
          type: 'number.base',
          context: { label: 'accountId', value: 'string', key: 'accountId' },
        },
      ]

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      const { error } = responseBody

      expect(res.statusCode).toEqual(400)
      expect(error).toEqual(expectedError)
    })

    test('should return 400 when the request body"s accountId is a boolean', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: true },
      }

      const expectedError = [
        {
          message: '"accountId" must be a number',
          path: ['accountId'],
          type: 'number.base',
          context: { label: 'accountId', value: true, key: 'accountId' },
        },
      ]

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      const { error } = responseBody

      expect(res.statusCode).toEqual(400)
      expect(error).toEqual(expectedError)
    })
  })
})
