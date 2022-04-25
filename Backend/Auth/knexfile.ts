import path from 'path'
const envFilePath = path.resolve(__dirname, '../env_variables/dev/auth/web/.env.auth.web')
require('dotenv').config({ path: envFilePath })

import { validatedSqlConnectionVariables } from './web/validation/server'

module.exports = validatedSqlConnectionVariables
