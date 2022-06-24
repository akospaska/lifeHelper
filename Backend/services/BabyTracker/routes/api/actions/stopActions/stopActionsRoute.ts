import { ResponseToolkit, Request } from 'hapi'
import { getValidatedStopActionRequestBody } from '../../../../validation/actions'

import { isTheChildBelongsToTheAccountId } from '../../../../dataAccessLayer/children'
import { throwGlobalError } from '../../../../utils/errorHandling'
import { isTheActionRecordingByIncrementedActionId, stopActionRecording } from '../../../../dataAccessLayer/actions'

export const stopActionsRoute = {
  method: 'post',
  path: '/api/stopactions',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    const requestBody = req.payload as unknown as any
    //1. validate is accountId and childId exists in the request body
    const { accountId, childId, incrementedActionId } = getValidatedStopActionRequestBody(requestBody)

    //2. is the child belongs to the requester
    const isChildBelongsToTheRequester = await isTheChildBelongsToTheAccountId(childId, accountId)

    //3. if false? throw error
    if (!isChildBelongsToTheRequester) throwGlobalError('Access Denied!', 403)

    //4. Check is the action is on recording? if false? throw error
    const isTheActionOnRecording = await isTheActionRecordingByIncrementedActionId(incrementedActionId, childId)
    const x = 1
    if (!isTheActionOnRecording) throwGlobalError('The action is not recording!', 405)

    //4. Update the action
    const updateResult = await stopActionRecording(incrementedActionId)
    //If the update was unsuccessfully, than throw an error
    if (updateResult <= 0 || !updateResult) throwGlobalError('Database Error!!!', 500)

    //5. Send ok back
    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
