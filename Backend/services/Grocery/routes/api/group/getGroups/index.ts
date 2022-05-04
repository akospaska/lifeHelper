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
    //1. input field validation
    const { accountId } = Joi.attempt(req.payload, getGroupsRequestBodySchema, globalJoiOptions)

    //2. Get groups based on the accountId
    const groups = await getGroups(accountId)

    //3. create the hapi response
    const response = h.response(groups).code(200)

    return response
  },
}
