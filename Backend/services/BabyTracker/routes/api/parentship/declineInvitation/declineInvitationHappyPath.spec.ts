import { serverInit } from '../../../../server'

import { knex, prepareDbForTests, sqlClose, sqlInit } from '../../../../databases/sql'
import { getInvitation } from '../../../../dataAccessLayer/parentship'

describe('Happy Path parentship decline invitation', () => {
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

  describe('Happy Path', () => {
    test('should return 200 and isValid:true the request body contains only valid data and the invitation is still pending', async () => {
      const injectOptions = {
        method: testMethod,
        url: testUrl,
        payload: { accountId: 10, invitationId: 1 },
      }

      const expectedResponse = { isValid: true }
      const res = await server.inject(injectOptions)
      const responseBody = JSON.parse(res.payload)

      let invitationFindError

      try {
        await getInvitation(11, 1)
      } catch (err) {
        invitationFindError = err.message
      }

      expect(res.statusCode).toEqual(200)
      expect(responseBody).toEqual(expectedResponse)
      expect(invitationFindError).toEqual('Invitation not found')
    })
  })
})
