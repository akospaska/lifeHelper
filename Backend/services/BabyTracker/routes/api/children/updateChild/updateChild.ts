import { ResponseToolkit, Request } from 'hapi'

import { getValidatedUpdateChildRequestBody } from '../../../../validation/children/getChildren'

import { isTheChildBelongsToTheAccountId, updateChild } from '../../../../dataAccessLayer/children'

export const updateChildRoute = {
  method: 'post',
  path: '/api/children/updatechild',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body

    const requestBody = req.payload as unknown as any
    const { accountId, childId, name, isDefault } = getValidatedUpdateChildRequestBody(requestBody)

    //2. Check is the child belongs to the accountId
    await isTheChildBelongsToTheAccountId(childId, accountId)

    await updateChild(childId, name, isDefault)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
