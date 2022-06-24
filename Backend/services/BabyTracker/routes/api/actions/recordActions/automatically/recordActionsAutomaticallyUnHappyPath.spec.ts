import { serverInit } from '../../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../../databases/sql'

describe('UnHappy Path record actions automatically endpoint test test with DB connection', () => {
  const actionTableName = 'action'

  const testUrl = '/api/actions/recordactions/automatically'
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
    await knex(actionTableName).truncate()
  })

  describe('Against the business logic tests', () => {
    test('should return 403 and error details when the child not belongs to the requester', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1, childId: 11, actionId: 4 },
      }

      const expectedResponse = { code: 403, isValid: false, errorMessage: 'Access Denied!' }

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(expectedResponse.code)
      expect(responseBody.errorMessage).toEqual(expectedResponse.errorMessage)
    })

    test('should return 405 and error details when the requested actionId is already on recording', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1, childId: 1, actionId: 4 },
      }

      const expectedResponse = { code: 405, isValid: false, errorMessage: 'Action is allready on recording!' }

      // start Record TheAction
      await server.inject(injectOptions)

      //Start recording the same action with the same child again
      const tryStartRecordTheActionAgainResponse = await server.inject(injectOptions)

      const responseBody = JSON.parse(tryStartRecordTheActionAgainResponse.payload)

      expect(tryStartRecordTheActionAgainResponse.statusCode).toEqual(expectedResponse.code)
      expect(responseBody.errorMessage).toEqual(expectedResponse.errorMessage)
    })
  })

  describe('Joi Validation Error tests', () => {
    test('should return 400 and error details when the accountId is missing from the body request', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { childId: 1, actionId: 4 },
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

      expect(res.statusCode).toEqual(400)
      expect(responseBody.errorMessage).toEqual(expectedResponse.errorMessage)
      expect(responseBody.error).toEqual(expectedResponse.error)
    })

    test('should return 400 and error details when the childId is missing from the body request', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1, actionId: 4 },
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

      expect(res.statusCode).toEqual(400)
      expect(responseBody.errorMessage).toEqual(expectedResponse.errorMessage)
      expect(responseBody.error).toEqual(expectedResponse.error)
    })

    test('should return 400 and error details when the actionId is missing from the body request', async () => {
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
            message: '"actionId" is required',
            path: ['actionId'],
            type: 'any.required',
            context: { label: 'actionId', key: 'actionId' },
          },
        ],
      }

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(responseBody.errorMessage).toEqual(expectedResponse.errorMessage)
      expect(responseBody.error).toEqual(expectedResponse.error)
    })

    test('should return 400 and error details when the accountId"s type is not a number', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 'iamastring', childId: 1, actionId: 4 },
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
            context: { label: 'accountId', value: 'iamastring', key: 'accountId' },
          },
        ],
      }

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(responseBody.errorMessage).toEqual(expectedResponse.errorMessage)
      expect(responseBody.error).toEqual(expectedResponse.error)
    })

    test('should return 400 and error details when the childId"s type is not a number', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1, childId: 'iamastring', actionId: 4 },
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
            context: { label: 'childId', value: 'iamastring', key: 'childId' },
          },
        ],
      }

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(responseBody.errorMessage).toEqual(expectedResponse.errorMessage)
      expect(responseBody.error).toEqual(expectedResponse.error)
    })

    test('should return 400 and error details when the actionId"s type is not a number', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 1, childId: 1, actionId: 'iamastring' },
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
            context: { label: 'actionId', value: 'iamastring', key: 'actionId' },
          },
        ],
      }

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toEqual(400)
      expect(responseBody.errorMessage).toEqual(expectedResponse.errorMessage)
      expect(responseBody.error).toEqual(expectedResponse.error)
    })
  })
})
