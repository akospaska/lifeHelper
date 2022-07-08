import { ResponseToolkit, Request } from 'hapi'
import { AxiosResponse } from 'axios'
import { babyTrackerServiceApi } from '../../../../api/services/babyTrackerService'
import { authServiceApi } from '../../../../api/services/authService'

export const inviteParentShipRoute = {
  method: 'POST',
  path: '/api/babytracker/parentship/invite',
  options: {
    auth: 'authByCookieSession',
    handler: async (req: Request, h: ResponseToolkit, err?: Error) => {
      const accountId = req.auth.credentials['accountId']

      const requestBody = req.payload ? req.payload : {}
      requestBody['accountId'] = accountId

      console.log(requestBody['email'])

      const axiosResponse: AxiosResponse = await authServiceApi.post('api/getemailbyid', {
        email: requestBody['email'],
      })

      console.log(axiosResponse.data)

      const validateLoginAxiosResponse: AxiosResponse = await babyTrackerServiceApi.post(`/api/parentship/invite`, {
        accountId,
        consigneeAccountId: axiosResponse.data.accountId,
      })

      const loginValidationResult = validateLoginAxiosResponse.data

      //const response = h.response(loginValidationResult).code(200)

      const response = h.response(loginValidationResult).code(200)
      return response
    },
  },
}

//{"consigneeAccountId":22}
