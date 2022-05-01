import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../../../utils/joi'

import { getGroupsRequestBodySchema } from '../../../../validation/group'
import { getGroups } from '../../../../databases/sql'
import { handleError } from '../../../../utils/errorHandling'

export const getGroupsRoute = {
  method: 'POST',
  path: '/api/group/getgroups',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    try {
      //1. input field validation
      const { accountId } = Joi.attempt(req.payload, getGroupsRequestBodySchema, globalJoiOptions)

      const groups = await getGroups(accountId)

      const response = h.response(groups).code(200)

      return response
    } catch (error) {
      const errorResponseBody = handleError(error)
      const response = h.response(errorResponseBody).code(errorResponseBody.code)
      return response
    }
  },
}
