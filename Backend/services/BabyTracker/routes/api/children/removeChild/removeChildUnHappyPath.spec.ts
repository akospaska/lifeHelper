import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'
import { getChild } from '../../../../dataAccessLayer/children'

describe('UnHappy Path remove child endpoint test', () => {
  const childTableName = 'child'

  const testUrl = '/api/children/removechild'
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
    describe('Joi validation errors', () => {
      test('should return 400 and error details when the accountId is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { childId: 1 },
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
        console.log(res.payload)
        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the childId is missing from the request body', async () => {
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
              message: '"childId" is required',
              path: ['childId'],
              type: 'any.required',
              context: { label: 'childId', key: 'childId' },
            },
          ],
        }
        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the accountId is not a valid integer', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { childId: 1, accountId: '1asdasd' },
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
              context: { label: 'accountId', value: '1asdasd', key: 'accountId' },
            },
          ],
        }
        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the childId is not a valid integer', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { childId: '1asdasd', accountId: 1 },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"childId" must be a number',
              path: ['childId'],
              type: 'number.base',
              context: { label: 'childId', value: '1asdasd', key: 'childId' },
            },
          ],
        }
        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })
    })
    describe('Against the business logic', () => {
      test('should return 403 and error details when the child is not belongs to the accountId', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { childId: 1, accountId: 2 },
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
