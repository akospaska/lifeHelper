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

  describe('Happy Path', () => {
    test('should return 200 and active invitations reesults when te request body contains valid data and the requested accountId has been sent an invitation', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 10 },
      }

      const expectedResponse = {
        invitationsReceived: [],
        invited: [{ id: 1, createdBy: 10, invited: 11, isAccepted: 0, isAnswered: 0 }],
      }

      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toBe(200)
      expect(responseBody).toEqual(expectedResponse)
    })

    test('should return 200 and active invitations reesults when te request body contains valid data and the accountId has received an invitation', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 11 },
      }

      const expectedResponse = {
        invitationsReceived: [{ id: 1, createdBy: 10, invited: 11, isAccepted: 0, isAnswered: 0 }],
        invited: [],
      }
      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toBe(200)
      expect(responseBody).toEqual(expectedResponse)
    })

    test('should return 200 and empty invitationResults when the accountId has not been invited and has not been sent an invitation', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 19 },
      }

      const expectedResponse = {
        invitationsReceived: [],
        invited: [],
      }
      const res = await server.inject(injectOptions)

      const responseBody = JSON.parse(res.payload)

      expect(res.statusCode).toBe(200)
      expect(responseBody).toEqual(expectedResponse)
    })
  })
})
