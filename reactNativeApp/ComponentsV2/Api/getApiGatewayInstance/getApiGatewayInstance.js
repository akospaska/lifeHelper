const axios = require('axios')

export const getApiGatewayInstance = (sessionKey) => {
  return axios.create({
    baseURL: 'http://127.0.0.1:5000/',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `lifeHelperSession=${sessionKey}`,
    },
  })
}
