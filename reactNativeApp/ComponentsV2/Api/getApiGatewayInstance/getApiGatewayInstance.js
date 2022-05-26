const axios = require('axios')

export const getApiGatewayInstance = (sessionKey) => {
  return axios.create({
    baseURL: 'http://172.27.41.67:443/',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `lifeHelperSession=${sessionKey}`,
    },
  })
}
