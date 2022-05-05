import path from 'path'
const envFilePath = path.resolve(__dirname, '../../../env_variables/dev/auth/worker/.env.auth.worker')

const envFilePath2 = path.resolve(__dirname, '../../../env_variables/dev/.env.services')

require('dotenv').config({ path: envFilePath })

require('dotenv').config({ path: envFilePath2 })

import { serverStart } from './server'
serverStart()
