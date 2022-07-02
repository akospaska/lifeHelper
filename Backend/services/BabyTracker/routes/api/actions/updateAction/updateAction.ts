import { ResponseToolkit, Request } from 'hapi'
import { isTheRequesterAccountBelongsToTheAction, updateAction } from '../../../../dataAccessLayer/actions'

import { getValidatedUpdateActionRequestBody, updateActionTypeRequestBodyType } from '../../../../validation/actions'

export const updateActionRoute = {
  method: 'post',
  path: '/api/actions/updateaction',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as updateActionTypeRequestBodyType

    const { accountId, startTime, endTime, comment, actionId } = getValidatedUpdateActionRequestBody(requestBody)

    //Check is the statistic belongs to the requester accountId
    await isTheRequesterAccountBelongsToTheAction(actionId, accountId)

    //Do the update itself!
    await updateAction(actionId, startTime, endTime, comment)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
