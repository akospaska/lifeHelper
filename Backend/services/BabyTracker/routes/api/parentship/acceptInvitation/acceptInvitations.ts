import { ResponseToolkit, Request } from 'hapi'
import {
  acceptInvitation,
  insertNewParentsToConnectTable,
  getInvitation,
  deleteAllThePendingInvitations,
} from '../../../../dataAccessLayer/parentship'

import { acceptInvitationRequestBody, getValidatedAcceptInvitationRequestBody } from '../../../../validation/parentship'

export const acceptParentInvitationRoute = {
  method: 'post',
  path: '/api/parentship/acceptinvitation',
  handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
    //1. validate is accountId exists in the request body
    const requestBody = req.payload as unknown as acceptInvitationRequestBody

    const { accountId, invitationId } = getValidatedAcceptInvitationRequestBody(requestBody)

    //1. check is the accountId is invited  by the invitationid?
    //Get the invitation details
    const invitation = await getInvitation(accountId, invitationId)

    //2. update the invitation
    await acceptInvitation(accountId, invitationId)

    //3. insert the new parentconnnect record to db
    insertNewParentsToConnectTable(invitation.createdBy, accountId)

    //Check and delete all the pending invitations by the inviter and the invited

    await deleteAllThePendingInvitations(invitation.createdBy, accountId)

    //5. return
    const response = h.response({ isValid: true }).code(200)

    return response
  },
}
