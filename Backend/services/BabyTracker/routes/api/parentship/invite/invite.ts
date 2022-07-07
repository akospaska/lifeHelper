import { ResponseToolkit, Request } from 'hapi'
import {
  checkIsTheInvitationAlreadySent,
  checkIsTheInvitationSendIsPossible,
  insertNewInvitation,
  isTheAccountIdBelongsToAparent,
} from '../../../../dataAccessLayer/parentship'
import { throwGlobalError } from '../../../../utils/errorHandling'

import {
  getValidatedInviteParentShipRequestBody,
  inviteParentShipRequestBodyType,
} from '../../../../validation/parentship'

export const inviteToParentShipRoute = {
  method: 'post',
  path: '/api/parentship/invite',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as inviteParentShipRequestBodyType

    const { accountId, consigneeAccountId } = getValidatedInviteParentShipRequestBody(requestBody)

    const gotAlreadyPartner = await isTheAccountIdBelongsToAparent(accountId)

    if (gotAlreadyPartner) throwGlobalError('Already got a partner', 403)

    await checkIsTheInvitationAlreadySent(accountId, consigneeAccountId)

    await checkIsTheInvitationSendIsPossible(accountId, consigneeAccountId)

    //4. send invitation
    await insertNewInvitation(accountId, consigneeAccountId)

    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
