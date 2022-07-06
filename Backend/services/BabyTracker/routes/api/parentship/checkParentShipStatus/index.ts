import { ResponseToolkit, Request } from 'hapi'

import { isTheAccountIdBelongsToAparent } from '../../../../dataAccessLayer/parentship'

import {
  getCheckParentShipStatusRequestBodyType,
  getValidatedCheckParentShipRequestBody,
} from '../../../../validation/parentship'

export const checkParentShipStatusRoute = {
  method: 'post',
  path: '/api/parentship/checkstatus',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as getCheckParentShipStatusRequestBodyType

    const { accountId } = getValidatedCheckParentShipRequestBody(requestBody)

    const gotPartner = await isTheAccountIdBelongsToAparent(accountId)

    const response = h.response({ isValid: gotPartner }).code(200)

    return response
  },
}
