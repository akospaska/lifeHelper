import { ResponseToolkit, Request } from 'hapi'

import { getValidatedRemoveChildRequestBody } from '../../../../validation/children/getChildren'

import { isTheChildBelongsToTheAccountId, removeChild } from '../../../../dataAccessLayer/children'

export const removeChildRoute = {
  method: 'post',
  path: '/api/children/removechild',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body

    const requestBody = req.payload as unknown as any
    const { accountId, childId } = getValidatedRemoveChildRequestBody(requestBody)

    //2. Check is the child belongs to the accountId
    await isTheChildBelongsToTheAccountId(childId, accountId)

    await removeChild(childId)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
