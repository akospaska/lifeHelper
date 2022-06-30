import { ResponseToolkit, Request } from 'hapi'

import {
  getValidatedRemoveChildRequestBody,
  getValidatedUpdateChildRequestBody,
} from '../../../../validation/children/getChildren'

import { isTheChildBelongsToTheAccountId, removeChild, updateChild } from '../../../../dataAccessLayer/children'

import { throwGlobalError } from '../../../../utils/errorHandling'

export const removeChildRoute = {
  method: 'post',
  path: '/api/children/removechild',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body

    const requestBody = req.payload as unknown as any
    const { accountId, childId } = getValidatedRemoveChildRequestBody(requestBody)

    //2. Check is the child belongs to the accountId
    const isTheChildBelongsToTheAccount = await isTheChildBelongsToTheAccountId(childId, accountId)

    if (!isTheChildBelongsToTheAccount) throwGlobalError('Access Denied!', 403)

    const removeResult = await removeChild(childId)

    if (removeResult > 1) throwGlobalError('Oppsy, Call the Sys Admin Now!!44!', 500)
    if (removeResult != 1) throwGlobalError('Oppsy, something gone wrong!', 400)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
