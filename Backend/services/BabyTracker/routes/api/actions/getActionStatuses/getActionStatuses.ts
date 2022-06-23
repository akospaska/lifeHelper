import { ResponseToolkit, Request } from 'hapi'
import { getActionStatusesRequestBodyType, getValidatedGetActionsRequestBody } from '../../../../validation/actions'

import { isTheChildBelongsToTheAccountId } from '../../../../dataAccessLayer/children'
import { throwGlobalError } from '../../../../utils/errorHandling'
import { getActionStatuses } from '../../../../dataAccessLayer/actions'

export const getActionStatusesRoute = {
  method: 'post',
  path: '/api/getactionstatuses',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const requestBody = req.payload as unknown as getActionStatusesRequestBodyType
    //1. validate is accountId and childId exists in the request body
    const { accountId, childId } = getValidatedGetActionsRequestBody(requestBody)

    //2. is the child belongs to the requester
    const isChildBelongsToTheRequester = await isTheChildBelongsToTheAccountId(childId, accountId)
    console.log(isChildBelongsToTheRequester)
    //3. if false? throw error
    if (!isChildBelongsToTheRequester) throwGlobalError('Access Denied!', 403)

    //get actionsStatuses
    const actionsStatuses = await getActionStatuses(accountId, childId)
    console.log('I have survived4')
    const response = h.response(actionsStatuses).code(200)

    return response
  },
}
