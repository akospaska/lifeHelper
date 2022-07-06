import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'
import { getChild } from '../../../../dataAccessLayer/children'

describe('UnHappy Path update child endpoint tests', () => {
  const childTableName = 'child'

  const testUrl = '/api/children/updatechild'
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
          payload: { childId: 1, name: 'updatedTest', isDefault: true },
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

      test('should return 400 and error details when the childId is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, name: 'updatedTest', isDefault: true },
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

      test('should return 400 and error details when the isDefault is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, childId: 1, name: 'updatedTest' },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"isDefault" is required',
              path: ['isDefault'],
              type: 'any.required',
              context: { label: 'isDefault', key: 'isDefault' },
            },
          ],
        }
        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the childId is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, name: 'updatedTest', isDefault: true },
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
          payload: { accountId: '1asdas', childId: 1, name: 'updatedTest', isDefault: true },
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
              context: { label: 'accountId', value: '1asdas', key: 'accountId' },
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
          payload: { accountId: 1, childId: '1asdas', name: 'updatedTest', isDefault: true },
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
              context: { label: 'childId', value: '1asdas', key: 'childId' },
            },
          ],
        }
        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the name is an empty string', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, childId: '1asdas', name: '', isDefault: true },
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
              context: { label: 'childId', value: '1asdas', key: 'childId' },
            },
            {
              message: '"name" is not allowed to be empty',
              path: ['name'],
              type: 'string.empty',
              context: { label: 'name', value: '', key: 'name' },
            },
          ],
        }
        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the isDefault is not a boolean', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, childId: 1, name: 'asdasd', isDefault: 'truebool' },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"isDefault" must be a boolean',
              path: ['isDefault'],
              type: 'boolean.base',
              context: { label: 'isDefault', value: 'truebool', key: 'isDefault' },
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
      test('should return 403 and error details when the childId is not belongs to the accountId', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, childId: 2, name: 'updatedTest', isDefault: true },
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
