import { AxiosResponse } from 'axios'

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
