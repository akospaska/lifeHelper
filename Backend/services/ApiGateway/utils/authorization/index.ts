import { AxiosResponse } from 'axios'

import { sessionExtractor } from '../sessionExtractor'

import { authServiceApi } from '../../api/services/authService'

export const authorizateUserRequest = async (cookiesArray) => {
  const sessionValue = cookiesArray?.lifeHelperSession

  const validateLoginAxiosResponse: AxiosResponse = await authServiceApi.post('/api/me', {
    sessionKey: sessionValue,
  })

  const loginValidationResult: authorizeResponseBody = validateLoginAxiosResponse.data

  return loginValidationResult
}

interface authorizeResponseBody {
  _id: string
  accountId: number
  isAdmin: number
  groupId: number
  sessionKey: string
}

export const authorizationSchema = function (server, options) {
  return {
    authenticate: async function (request, h) {
      //get the sessionCookie
      console.log('I am the all the cookies')
      console.log(request.headers.cookie)
      const sessionValue = sessionExtractor(request)
      console.log(sessionValue)

      try {
        const identifyMeRequestPromise: Promise<AxiosResponse> = authServiceApi.post('/api/me', {
          sessionKey: sessionValue,
        })
        const response = await identifyMeRequestPromise

        return h.authenticated({ credentials: response.data })
      } catch (err) {
        return h.authenticated({ credentials: err.response.data })
      }
    },
  }
}
