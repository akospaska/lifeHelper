import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('UnHappy Path parentship invite parent endpoint tests', () => {
  const childConnectTableName = 'parentConnect'

  const testUrl = '/api/parentship/invite'
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
    describe('Against the business logic', () => {
      test('should return 403 and error details when between the consignee and the requester has already a pending invitation', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 10, consigneeAccountId: 11 },
        }

        const expectedResponse = { code: 403, isValid: false, errorMessage: 'Invitation is already pending!' }

        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 403 and error details when the consignee has already a partner', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 18, consigneeAccountId: 1 },
        }

        const expectedResponse = { code: 403, isValid: false, errorMessage: 'The consignee already has a partner' }

        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 403 and error details when the requester has already a partner', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 1, consigneeAccountId: 19 },
        }

        const expectedResponse = { code: 403, isValid: false, errorMessage: 'Already got a partner' }

        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })
    })
    describe('Joi validation errors', () => {
      test('should return 400 and error details when the accountId is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { consigneeAccountId: 11 },
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

      test('should return 400 and error details when the consigneeAccountId is missing from the request body', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 123 },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"consigneeAccountId" is required',
              path: ['consigneeAccountId'],
              type: 'any.required',
              context: {
                label: 'consigneeAccountId',
                key: 'consigneeAccountId',
              },
            },
          ],
        }

        const res = await server.inject(injectOptions)

        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the consigneeAccountId is is not a valid integer', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: 123, consigneeAccountId: '123asd' },
        }

        const expectedResponse = {
          code: 400,
          isValid: false,
          errorMessage: 'RequestBody Validation Failed',
          error: [
            {
              message: '"consigneeAccountId" must be a number',
              path: ['consigneeAccountId'],
              type: 'number.base',
              context: { label: 'consigneeAccountId', value: '123asd', key: 'consigneeAccountId' },
            },
          ],
        }

        const res = await server.inject(injectOptions)
        const responseBody = JSON.parse(res.payload)

        expect(res.statusCode).toEqual(expectedResponse.code)
        expect(responseBody).toEqual(expectedResponse)
      })

      test('should return 400 and error details when the accountId is is not a valid integer', async () => {
        const injectOptions = {
          method: testMethod,
          url: testUrl,
          payload: { accountId: '123asd', consigneeAccountId: 123 },
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
              context: { label: 'accountId', value: '123asd', key: 'accountId' },
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
