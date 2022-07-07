import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('Happy Path parentship divorce parentship endpoint test', () => {
  const childConnectTableName = 'parentConnect'

  const testUrl = '/api/parentship/divorce'
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

  describe('Happy Path', () => {
    describe('Joi validation errors', () => {
      test('should return 400 and error details when accountId is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: {},
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

      test('should return 400 and error details when accountId is not a valid integer', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: '1asd' },
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
      test('should return 403 and error details when the accountId has not any partner', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 7 },
        }

        const expectedResponse = { code: 403, isValid: false, errorMessage: 'The requester has no any partner!' }

        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })
    })
  })
})
