const axios = require('axios')

import { API_URL } from '@env'

export const apiendpoint = axios.create({
  baseURL: 'http://18.184.106.191/',
})
