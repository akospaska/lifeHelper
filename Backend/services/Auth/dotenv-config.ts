const path = require('path')
const dotenv = require('dotenv')

const envFilePath = path.resolve(__dirname, '../../../Backend/env_variables/test/auth/web/.env.auth.web')

module.exports = async () => {
  dotenv.config({ path: path.resolve(envFilePath) })
}
