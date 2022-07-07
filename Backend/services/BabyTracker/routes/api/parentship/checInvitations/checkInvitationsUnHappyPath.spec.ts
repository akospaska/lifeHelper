import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('Happy Path check parentInvitations statuses', () => {
  const parentInvitationTableName = 'parentInvitation'

  const testUrl = '/api/parentship/checkparentinvitations'
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
    test('should return 400 and error details when the accountID is missing from the requestBody', async () => {
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

      expect(res.statusCode).toBe(expectedResponse.code)
      expect(responseBody).toEqual(expectedResponse)
    })

    test('should return 400 and error details when the accountID is not a valid integer', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: '11asd' },
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
            context: { label: 'accountId', value: '11asd', key: 'accountId' },
          },
        ],
      }
      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toBe(expectedResponse.code)
      expect(responseBody).toEqual(expectedResponse)
    })
  })
})
