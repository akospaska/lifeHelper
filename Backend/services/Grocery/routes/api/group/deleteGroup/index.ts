import * as Joi from 'joi'
import { ResponseToolkit, Request } from 'hapi'

import { globalJoiOptions } from '../../../../utils/joi'

import { deleteGroupRequestBodySchema } from '../../../../validation/group'
import { deleteGroup, deleteGroupConnectRecord, isTheAccountBelongsToTheGroup } from '../../../../databases/sql'
import { throwGlobalError } from '../../../../utils/errorHandling'

export const deleteGroupRoute = {
  method: 'POST',
  path: '/api/group/deletegroup',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. input field validation
    const { accountId, groupId } = Joi.attempt(req.payload, deleteGroupRequestBodySchema, globalJoiOptions)

    //2. Check permission
    const gotPermission = await isTheAccountBelongsToTheGroup(accountId, groupId)

    if (!gotPermission) throwGlobalError('Permission denied!', 403)

    //3. delete the group

    await deleteGroup(groupId)

    //4. delete the groupConnect record
    await deleteGroupConnectRecord(groupId, accountId)

    const responseBody = { isValid: gotPermission }
    //3. create the hapi response
    const response = h.response(responseBody).code(200)

    return response
  },
}
