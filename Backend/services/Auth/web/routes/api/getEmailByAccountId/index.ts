import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { getAccountIdByEmail, getEmailByAccountId } from '../../../Databases/sql'

export const getEmailByAccountIdRoute = {
  method: 'POST',
  path: '/api/getemailbyaccountid',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const { accountId } = req.payload as unknown as { accountId: number }

    const foundAccountIdWithEmail = await getEmailByAccountId(accountId)

    const response = h.response(foundAccountIdWithEmail).code(200)

    return response
  },
}
