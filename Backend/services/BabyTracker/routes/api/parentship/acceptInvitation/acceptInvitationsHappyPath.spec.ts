import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'

describe('Happy Path accept invitations endpoint tests', () => {
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

  describe('Happy Path', () => {
    test('should return 200 and isValid:true object response when the accountId is belongs to the invitationId and the invitationId is still valid', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 11, invitationId: 1 },
      }

      const expectedResponse = {
        isValid: true,
      }

      const res = await server.inject(injectOptions)
      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toBe(200)
      expect(responseBody).toEqual(expectedResponse)
    })
  })
})
