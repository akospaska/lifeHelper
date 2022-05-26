const axios = require('axios')

export const apiendpoint = axios.create({
  baseURL: 'http://172.27.41.67:443/',
})
