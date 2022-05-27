const axios = require('axios')

import { API_URL } from '@env'

export const getApiGatewayInstance = (sessionKey) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Cookie: `lifeHelperSession=${sessionKey}`,
    },
  })
}
