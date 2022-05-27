const axios = require('axios')

import { API_URL } from '@env'

export const apiendpoint = axios.create({
  baseURL: API_URL,
})
