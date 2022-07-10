import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { getAccountIdByEmail } from '../../../Databases/sql'

export const getAccountIdByEmailRoute = {
  method: 'POST',
  path: '/api/getidbyemail',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const { email } = req.payload as unknown as { email: string }

    const accountId = await getAccountIdByEmail(email)

    const response = h.response({ isValid: true, accountId: accountId }).code(200)

    return response
  },
}
