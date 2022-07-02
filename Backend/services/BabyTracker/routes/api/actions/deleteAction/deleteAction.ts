import { ResponseToolkit, Request } from 'hapi'

import { deleteAction, isTheRequesterAccountBelongsToTheAction } from '../../../../dataAccessLayer/actions'
import { deleteActionRequestBodyType, getValidatedDeleteActionRequestBody } from '../../../../validation/actions'

export const deleteActionRoute = {
  method: 'post',
  path: '/api/actions/deleteaction',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as deleteActionRequestBodyType

    const { accountId, actionId } = getValidatedDeleteActionRequestBody(requestBody)

    //Check is the statistic belongs to the requester accountId
    await isTheRequesterAccountBelongsToTheAction(actionId, accountId)

    //Soft delete the statistic
    await deleteAction(actionId)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
