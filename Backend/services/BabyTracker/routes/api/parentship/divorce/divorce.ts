import { ResponseToolkit, Request } from 'hapi'

import {
  getCheckParentShipStatusRequestBodyType,
  getValidatedCheckParentShipRequestBody,
} from '../../../../validation/parentship'

export const divorceParentShipRoute = {
  method: 'post',
  path: '/api/parentship/divorce',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as getCheckParentShipStatusRequestBodyType

    const { accountId } = getValidatedCheckParentShipRequestBody(requestBody)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
