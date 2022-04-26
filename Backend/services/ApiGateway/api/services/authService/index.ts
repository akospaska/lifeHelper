const axios = require('axios')

export const authServiceApi = axios.create({
  baseURL: `http://${process.env.AUTH_SERVICE_HOST}:${process.env.AUTH_SERVICE_PORT}/`,
})
