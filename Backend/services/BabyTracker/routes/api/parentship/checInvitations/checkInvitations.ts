import { ResponseToolkit, Request } from 'hapi'
import { checkParentInvitationsStatus } from '../../../../dataAccessLayer/parentship'

import {
  getCheckParentShipStatusRequestBodyType,
  getValidatedCheckParentShipRequestBody,
} from '../../../../validation/parentship'

export const checkParentInvitationsRoute = {
  method: 'post',
  path: '/api/parentship/checkparentinvitations',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as getCheckParentShipStatusRequestBodyType

    const { accountId } = getValidatedCheckParentShipRequestBody(requestBody)

    const parentInvitationsResult = await checkParentInvitationsStatus(accountId)

    const response = h.response(parentInvitationsResult).code(200)

    return response
  },
}
