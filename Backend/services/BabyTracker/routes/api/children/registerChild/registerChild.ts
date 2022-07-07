import { ResponseToolkit, Request } from 'hapi'

import {
  getValidatedRegisterChildRequestBody,
  registerChildRequestBodyType,
} from '../../../../validation/children/getChildren'

import { registerChild } from '../../../../dataAccessLayer/children'

export const registerChildRoute = {
  method: 'post',
  path: '/api/children/registerchild',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body

    const requestBody = req.payload as unknown as registerChildRequestBodyType
    const { accountId, name } = getValidatedRegisterChildRequestBody(requestBody)

    await registerChild(accountId, name)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
