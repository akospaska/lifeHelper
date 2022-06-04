const axios = require('axios')

import { API_URL } from '@env'

export const getApiGatewayInstance = (sessionKey) => {
  return axios.create({
    baseURL: 'http://172.28.240.142:5000/',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `lifeHelperSession=${sessionKey}`,
    },
  })
}
