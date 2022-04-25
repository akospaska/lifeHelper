import path from 'path'
const envFilePath = path.resolve(__dirname, '../../env_variables/dev/auth/web/.env.auth.web')
require('dotenv').config({ path: envFilePath })

module.exports = validatedSqlConnectionVariables
import { validatedSqlConnectionVariables } from './validation/server'

export default {
  migrations: {
    // ... client, connection,etc ....
    directory: '.web/migrations',
    loadExtensions: ['.js'], // knex will search for 'mjs' file by default
  },
}
