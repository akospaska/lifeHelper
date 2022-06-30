import { ResponseToolkit, Request } from 'hapi'
import { getValidatedRecordActionsManuallyRequestBody } from '../../../../../validation/actions'

import { isTheChildBelongsToTheAccountId } from '../../../../../dataAccessLayer/children'
import { throwGlobalError } from '../../../../../utils/errorHandling'
import { startRecordingManually } from '../../../../../dataAccessLayer/actions'

export const recordActionManuallyRoute = {
  method: 'post',
  path: '/api/actions/recordactions/manually',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const requestBody = req.payload as unknown as any
    //1. validate is accountId and childId exists in the request body
    const { accountId, childId, actionId, actionStart, actionEnd, comment } =
      getValidatedRecordActionsManuallyRequestBody(requestBody)

    //2. is the child belongs to the requester
    const isChildBelongsToTheRequester = await isTheChildBelongsToTheAccountId(childId, accountId)

    //3. if false? throw error
    if (!isChildBelongsToTheRequester) throwGlobalError('Access Denied!', 403)

    //4. insert the new record
    const insertResult = await startRecordingManually(actionId, childId, accountId, actionStart, actionEnd, comment)

    //7. Send ok back
    const response = h.response({ isValid: insertResult }).code(200)

    return response
  },
}
