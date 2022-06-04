const axios = require('axios')

import { API_URL } from '@env'

export const apiendpoint = axios.create({
  baseURL: 'http://172.28.240.142:5000/',
})
