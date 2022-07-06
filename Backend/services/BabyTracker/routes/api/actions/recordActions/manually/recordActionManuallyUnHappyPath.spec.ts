import { serverInit } from '../../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../../databases/sql'

describe('Happy Path record actions automatically endpoint test test with DB connection', () => {
  const actionTableName = 'action'

  const testUrl = '/api/actions/recordactions/manually'
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
      test('should return 400 and error details when the accountId is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            childId: 1,
            actionId: 1,
            actionStart: 1657089699,
            actionEnd: 1657089699,
            comment: 'I am the comment',
          },
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
          payload: {
            accountId: 1,
            actionId: 1,
            actionStart: 1657089699,
            actionEnd: 1657089699,
            comment: 'I am the comment',
          },
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

      test('should return 400 and error details when the actionId is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            accountId: 1,
            childId: 1,
            actionStart: 1657089699,
            actionEnd: 1657089699,
            comment: 'I am the comment',
          },
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

      test('should return 400 and error details when the actionStart is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            accountId: 1,
            childId: 1,
            actionId: 1,
            actionEnd: 1657089699,
            comment: 'I am the comment',
          },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"actionStart" is required',
              path: ['actionStart'],
              type: 'any.required',
              context: { label: 'actionStart', key: 'actionStart' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the actionEnd is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            accountId: 1,
            childId: 1,
            actionStart: 1657089698,
            actionId: 1,
            comment: 'I am the comment',
          },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"actionEnd" is required',
              path: ['actionEnd'],
              type: 'any.required',
              context: { label: 'actionEnd', key: 'actionEnd' },
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
      test('should return 403 and error details when the accountId is not belongs to the child', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            accountId: 1,
            actionId: 1,
            childId: 2,
            actionStart: 1657089699,
            actionEnd: 1657089699,
            comment: 'I am the comment',
          },
        }

        const expectedResponse = { code: 403, isValid: false, errorMessage: 'Access Denied!' }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 403 and error details when the accountId is not belongs to the child', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            accountId: 1,
            actionId: 1111,
            childId: 1,
            actionStart: 1657089699,
            actionEnd: 1657089699,
            comment: 'I am the comment',
          },
        }

        const expectedResponse = { code: 500, isValid: false, errorMessage: 'Invalid actionId' }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })
    })
  })
})
