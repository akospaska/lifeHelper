import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('UnHappy Path register child endpoint tests', () => {
  const childTableName = 'child'

  const testUrl = '/api/children/registerchild'
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

  describe('UnHappy Path', () => {
    test('should return 400 and error details when the accountId is missing from the request body', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { name: 'test child' },
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

    test('should return 400 and error details when the name is missing from the request body', async () => {
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
            message: '"name" is required',
            path: ['name'],
            type: 'any.required',
            context: { label: 'name', key: 'name' },
          },
        ],
      }
      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(responseBody).toEqual(expectedResponse)
    })

    test('should return 400 and error details when the accountId is a string', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 'asd', name: 'test name' },
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
            context: { label: 'accountId', value: 'asd', key: 'accountId' },
          },
        ],
      }
      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(responseBody).toEqual(expectedResponse)
    })

    test('should return 400 and error details when the name not a string', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1, name: 123 },
      }

      const expectedResponse = {
        code: 400,
        isValid: false,
        errorMessage: 'RequestBody Validation Failed',
        error: [
          {
            message: '"name" must be a string',
            path: ['name'],
            type: 'string.base',
            context: { label: 'name', value: 123, key: 'name' },
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
})
