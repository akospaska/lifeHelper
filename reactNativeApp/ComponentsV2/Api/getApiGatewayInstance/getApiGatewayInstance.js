const axios = require('axios')

import { API_URL } from '@env'

export const getApiGatewayInstance = (sessionKey) => {
  return axios.create({
    baseURL: 'http://18.184.106.191/',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `lifeHelperSession=${sessionKey}`,
    },
  })
}
