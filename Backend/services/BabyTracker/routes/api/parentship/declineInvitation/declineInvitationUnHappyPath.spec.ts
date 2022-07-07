import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'
import { getInvitation } from '../../../../dataAccessLayer/parentship'

describe('UnHappy Path parentship decline invitation', () => {
  const childConnectTableName = 'parentConnect'

  const testUrl = '/api/parentship/declineinvitation'
  const testMethod = 'POST'

  let server

  beforeAll(async () => {
    await sqlInit()
    server = await serverInit()
    await prepareDbForTests()
  })

  afterAll(async () => {
    await knex(childConnectTableName).truncate()
    await server.stop()
    await sqlClose()
  })

  describe('UnHappy Path', () => {
    describe('Joi validation error', () => {
      test('should return 400 and error details when the accountId is missing', async () => {
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

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the invitationId is missing', async () => {
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

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the invitationId is not an integer', async () => {
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

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the accountId is not an integer', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: '1asd', invitationId: 11 },
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

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })
    })
    describe('Against the business logic', () => {
      test('should return 403 and error details when the invitationId is not exists', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 10, invitationId: 7 },
        }

        const expectedResponse = { code: 403, isValid: false, errorMessage: 'Invitation not found!' }
        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 403 and error details when the invitationId is not belongs to the accountId', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 10, invitationId: 2 },
        }

        const expectedResponse = { code: 403, isValid: false, errorMessage: 'Invitation not found!' }
        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })
    })
  })
})
