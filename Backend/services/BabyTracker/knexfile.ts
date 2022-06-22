import path from 'path'
const envFilePath = path.resolve(__dirname, '../../env_variables/dev/grocery/.env.grocery')
require('dotenv').config({ path: envFilePath })

import { validatedSqlConnectionVariables } from './validation/server'

module.exports = validatedSqlConnectionVariables
