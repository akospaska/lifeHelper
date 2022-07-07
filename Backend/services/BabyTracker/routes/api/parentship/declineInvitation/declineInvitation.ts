import { ResponseToolkit, Request } from 'hapi'
import { declineInvitation, isTheInvitationBelongsToTheAccountId } from '../../../../dataAccessLayer/parentship'

import { acceptInvitationRequestBody, getValidatedAcceptInvitationRequestBody } from '../../../../validation/parentship'

export const declineInvitationRoute = {
  method: 'post',
  path: '/api/parentship/declineinvitation',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as acceptInvitationRequestBody

    const { accountId, invitationId } = getValidatedAcceptInvitationRequestBody(requestBody)

    //1. check is the accountId is invited  by the invitationid?

    await isTheInvitationBelongsToTheAccountId(accountId, invitationId)

    //2. delete the invitation
    await declineInvitation(invitationId)

    //3. return the response body
    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
