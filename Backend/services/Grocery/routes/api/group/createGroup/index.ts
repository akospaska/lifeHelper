import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../utils/joi'

import { createGroupRequestBodySchema, getGroupsRequestBodySchema } from '../../../../validation/group'
import { createNewGroceryGroup, getGroups, insertNewGroupConnectRecord } from '../../../../databases/sql'

export const createGroupRoute = {
  method: 'POST',
  path: '/api/group/creategroup',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. input field validation
    const { accountId, newGroupName } = Joi.attempt(req.payload, createGroupRequestBodySchema, globalJoiOptions)

    //2. create the group
    const newCreatedGroupId = await createNewGroceryGroup(newGroupName, accountId)

    //3. insert into groupConnect

    await insertNewGroupConnectRecord(accountId, newCreatedGroupId)

    const responseBody = { isValid: true }
    //3. create the hapi response
    const response = h.response(responseBody).code(200)

    return response
  },
}
