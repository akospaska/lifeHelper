import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('Happy Path record actions automatically endpoint test test with DB connection', () => {
  const actionTableName = 'action'

  const testUrl = '/api/actions/updateaction'
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

    describe('Joi validation errors', () => {
      test('should return 400 and error details when the accountId is missing', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            actionId: 1,
            startTime: 1657089699,
            endTime: 1657089699,
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

      test('should return 400 and error details when the actionId is missing', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            accountId: 1,

            startTime: 1657089699,
            endTime: 1657089699,
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

      test('should return 400 and error details when the startTime is missing', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            accountId: 1,
            actionId: 1,
            endTime: 1657089699,
            comment: 'I am the comment',
          },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"startTime" is required',
              path: ['startTime'],
              type: 'any.required',
              context: { label: 'startTime', key: 'startTime' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the endTime is missing', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            accountId: 1,
            actionId: 1,
            startTime: 1657089697,
            comment: 'I am the comment',
          },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"endTime" is required',
              path: ['endTime'],
              type: 'any.required',
              context: { label: 'endTime', key: 'endTime' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the endTime is not a valid number', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            accountId: 1,
            actionId: 1,
            startTime: 1657089697,
            endTime: '1657089698asd',
            comment: 'I am the comment',
          },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"endTime" must be a number',
              path: ['endTime'],
              type: 'number.base',
              context: { label: 'endTime', value: '1657089698asd', key: 'endTime' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the startTime is not a valid number', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            accountId: 1,
            actionId: 1,
            endTime: 1657089697,
            startTime: '1657089698asd',
            comment: 'I am the comment',
          },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"startTime" must be a number',
              path: ['startTime'],
              type: 'number.base',
              context: { label: 'startTime', value: '1657089698asd', key: 'startTime' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the actionId is not a valid number', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            accountId: 1,
            actionId: 'asdasd1',
            endTime: 1657089697,
            startTime: 1657089698,
            comment: 'I am the comment',
          },
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
              context: { label: 'actionId', value: 'asdasd1', key: 'actionId' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the accountId is not a valid number', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {
            accountId: 'asdasd1',
            actionId: 1,
            endTime: 1657089697,
            startTime: 1657089698,
            comment: 'I am the comment',
          },
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
              context: { label: 'accountId', value: 'asdasd1', key: 'accountId' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })
    })
  })
})
