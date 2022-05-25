const axios = require('axios')

export const apiendpoint = axios.create({
  baseURL: 'http://127.0.0.1:5000/',
})
