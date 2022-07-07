import { ResponseToolkit, Request } from 'hapi'
import { divorceFromThePartner, isTheAccountIdBelongsToAparent } from '../../../../dataAccessLayer/parentship'
import { throwGlobalError } from '../../../../utils/errorHandling'

import {
  getValidatedCheckParentShipRequestBody,
  inviteParentShipRequestBodyType,
} from '../../../../validation/parentship'

export const divorceParentShipRoute = {
  method: 'post',
  path: '/api/parentship/divorce',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as inviteParentShipRequestBodyType

    const { accountId } = getValidatedCheckParentShipRequestBody(requestBody)

    const gotPartner = await isTheAccountIdBelongsToAparent(accountId)

    if (!gotPartner) throwGlobalError('The requester has no any partner!', 403)

    await divorceFromThePartner(accountId)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
