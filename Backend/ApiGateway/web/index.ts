import path from 'path'
const envFilePath = path.resolve(__dirname, '../../env_variables/dev/auth/web/.env.auth.web')

console.log(envFilePath)

require('dotenv').config({ path: envFilePath })

import { serverStart } from './server'
serverStart()
