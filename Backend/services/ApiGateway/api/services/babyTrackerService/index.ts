const axios = require('axios')

import { validatedWebProcessServerVariables } from '../../../validation/server'

const { babyTrackerHost, babyTrackerPort } = validatedWebProcessServerVariables

export const babyTrackerServiceApi = axios.create({
  baseURL: `http://${babyTrackerHost}:${babyTrackerPort}/`,
})
