import { ResponseToolkit, Request } from 'hapi'
import { getValidatedRecordActionsAutomaticallyRequestBody } from '../../../../../validation/actions'

import { isTheChildBelongsToTheAccountId } from '../../../../../dataAccessLayer/children'
import { throwGlobalError } from '../../../../../utils/errorHandling'
import { isTheActionInRecording, startRecordingAutomatically } from '../../../../../dataAccessLayer/actions'

export const recordActionsAutomaticallyRoute = {
  method: 'post',
  path: '/api/recordactions/automatically',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const requestBody = req.payload as unknown as any
    //1. validate is accountId and childId exists in the request body
    const { accountId, childId, actionId } = getValidatedRecordActionsAutomaticallyRequestBody(requestBody)

    //2. is the child belongs to the requester
    const isChildBelongsToTheRequester = await isTheChildBelongsToTheAccountId(childId, accountId)

    //3. if false? throw error
    if (!isChildBelongsToTheRequester) throwGlobalError('Access Denied!', 403)

    //4. Check is the last action is on recording?

    const isTheLastActionOnRecording = await isTheActionInRecording(actionId, childId)

    //5. If yes, throw an error
    if (isTheLastActionOnRecording) throwGlobalError('Action is allready on recording!', 405)

    //6. start record the new action
    await startRecordingAutomatically(actionId, childId, accountId)

    //7. Send ok back
    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
