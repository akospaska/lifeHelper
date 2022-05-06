const axios = require('axios')

import { validatedWebProcessServerVariables } from '../../../validation/server'

const { authHost, authPort } = validatedWebProcessServerVariables

export const authServiceApi = axios.create({
  baseURL: `http://${authHost}:${authPort}/`,
})
