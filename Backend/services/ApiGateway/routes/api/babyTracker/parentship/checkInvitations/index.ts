import { ResponseToolkit, Request } from 'hapi'

import { babyTrackerServiceApi } from '../../../../../api/services/babyTrackerService'

import { requestForwarder } from '../../../../../utils/requestForwarder'
import { AxiosResponse } from 'axios'
import { authServiceApi } from '../../../../../api/services/authService'

export const checkInvitationsRoute = {
  method: 'GET',
  path: '/api/babytracker/parentship/checkparentinvitations',
  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      const accountId = req.auth.credentials['accountId']

      const requestBody = req.payload ? req.payload : {}
      requestBody['accountId'] = accountId

      const axiosResponse: AxiosResponse = await babyTrackerServiceApi.post(
        `api/parentship/checkparentinvitations`,
        requestBody
      )

      //Refactor this response body extension Found in Backlog
      let babyTrackServiceResponse = axiosResponse.data

      for (let index = 0; index < babyTrackServiceResponse.invited.length; index++) {
        const invitation = babyTrackServiceResponse.invited[index]

        const axiosResponse: AxiosResponse = await authServiceApi.post('api/getemailbyaccountid', {
          accountId: invitation.invited,
        })

        const foundAccountDetails: { id: number; email: string } = axiosResponse.data

        invitation.to = foundAccountDetails.email
      }

      for (let index = 0; index < babyTrackServiceResponse.invitationsReceived.length; index++) {
        const invitation = babyTrackServiceResponse.invitationsReceived[index]

        const axiosResponse: AxiosResponse = await authServiceApi.post('api/getemailbyaccountid', {
          accountId: invitation.createdBy,
        })

        const foundAccountDetails: { id: number; email: string } = axiosResponse.data

        invitation.from = foundAccountDetails.email
      }

      const response = h.response(babyTrackServiceResponse).code(200)
      return response
    },
  },
}
