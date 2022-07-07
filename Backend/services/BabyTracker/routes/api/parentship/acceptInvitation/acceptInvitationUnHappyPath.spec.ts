import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('UnHappy Path accept invitations endpoint tests', () => {
  const parentInvitationTableName = 'parentInvitation'

  const testUrl = '/api/parentship/acceptinvitation'
  const testMethod = 'POST'

  let server

  beforeAll(async () => {
    await sqlInit()

    server = await serverInit()

    await prepareDbForTests()
  })

  afterAll(async () => {
    await knex(parentInvitationTableName).truncate()
    await server.stop()
    await sqlClose()
  })

  beforeEach(async () => {
    await prepareDbForTests()
  })

  afterEach(async () => {
    await prepareDbForTests()
  })

  describe('UnHappy Path', () => {
    describe('Joi validation errors', () => {
      test('should return 400 and error details when the accountId is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { invitationId: 1 },
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

        expect(res.statusCode).toBe(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the invitationId is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 10 },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"invitationId" is required',
              path: ['invitationId'],
              type: 'any.required',
              context: { label: 'invitationId', key: 'invitationId' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toBe(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the invitationId is not a valid integer', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 10, invitationId: '1asd' },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"invitationId" must be a number',
              path: ['invitationId'],
              type: 'number.base',
              context: { label: 'invitationId', value: '1asd', key: 'invitationId' },
            },
          ],
        }
        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toBe(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the accountId is not a valid integer', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: '1asd', invitationId: 1 },
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
              context: { label: 'accountId', value: '1asd', key: 'accountId' },
            },
          ],
        }
        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toBe(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })
    })
    describe('Against the business logic', () => {
      test('should return 400 and error details when the invitationId has not been found', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 10, invitationId: 11 },
        }

        const expectedResponse = { code: 404, isValid: false, errorMessage: 'Invitation not found' }
        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toBe(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the invitationId isnot belongs to the accountId', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 10, invitationId: 2 },
        }

        const expectedResponse = { code: 404, isValid: false, errorMessage: 'Invitation not found' }
        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)
        console.log(res.payload)
        expect(res.statusCode).toBe(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })
    })
  })
})
