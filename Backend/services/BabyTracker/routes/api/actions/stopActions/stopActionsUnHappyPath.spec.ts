import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('Happy Path get action statuses endpoint test with DB connection', () => {
  const actionTableName = 'action'

  const testUrl = '/api/actions/stopactions'
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
  beforeEach(async () => {
    await prepareDbForTests()
  })
  afterEach(async () => {
    await knex(actionTableName).truncate()
  })

  describe('UnHappy Path', () => {
    describe('against the business logic', () => {
      test('should return 405 when the incrementedActionId is not recording', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, childId: 1, incrementedActionId: 2 },
        }

        const expectedResponse = {
          code: 405,
          isValid: false,
          errorMessage: 'The action is not recording!',
        }

        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 403 when the accountId is not belongs to the childId', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, childId: 2, incrementedActionId: 1 },
        }

        const expectedResponse = {
          code: 403,
          isValid: false,
          errorMessage: 'Access Denied!',
        }

        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 403 when the incrementedActionId is not belongs to the childId', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, childId: 1, incrementedActionId: 4 },
        }

        const expectedResponse = {
          code: 403,
          isValid: false,
          errorMessage: 'Access Denied!',
        }

        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        //check the actionIds enums
        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })
    })
    describe('Joi validation errors', () => {
      test('should return 400 and error details when the accountId is missing', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { childId: 1, incrementedActionId: 2 },
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
              context: {
                label: 'accountId',
                key: 'accountId',
              },
            },
          ],
        }

        const res = await server.inject(injectOptions)

        const { error } = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(error).toEqual(expectedResponse.error)
      })

      test('should return 400 and error details when the childId is missing', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, incrementedActionId: 4 },
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
              context: {
                label: 'childId',
                key: 'childId',
              },
            },
          ],
        }

        const res = await server.inject(injectOptions)

        const { error } = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(error).toEqual(expectedResponse.error)
      })

      test('should return 400 and error details when the incrementedActionId is missing', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, childId: 1 },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"incrementedActionId" is required',
              path: ['incrementedActionId'],
              type: 'any.required',
              context: {
                label: 'incrementedActionId',
                key: 'incrementedActionId',
              },
            },
          ],
        }

        const res = await server.inject(injectOptions)

        const { error } = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(error).toEqual(expectedResponse.error)
      })

      test('should return 400 and error details when the accountId is not a positive integer', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 'stringy', childId: 1, incrementedActionId: 4 },
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
              context: {
                label: 'accountId',
                value: 'stringy',
                key: 'accountId',
              },
            },
          ],
        }

        const res = await server.inject(injectOptions)

        const { error } = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(error).toEqual(expectedResponse.error)
      })

      test('should return 400 and error details when the childId is not a positive integer', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, childId: 'stringy', incrementedActionId: 4 },
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
              context: {
                label: 'childId',
                value: 'stringy',
                key: 'childId',
              },
            },
          ],
        }

        const res = await server.inject(injectOptions)

        const { error } = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(error).toEqual(expectedResponse.error)
      })

      test('should return 400 and error details when the accountId is not a positive integer', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, childId: 1, incrementedActionId: 'stringy' },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"incrementedActionId" must be a number',
              path: ['incrementedActionId'],
              type: 'number.base',
              context: {
                label: 'incrementedActionId',
                value: 'stringy',
                key: 'incrementedActionId',
              },
            },
          ],
        }

        const res = await server.inject(injectOptions)

        const { error } = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(error).toEqual(expectedResponse.error)
      })
    })
  })
})
