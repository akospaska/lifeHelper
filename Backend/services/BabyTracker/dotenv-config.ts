import path from 'path'

import dotenv from 'dotenv'

const envFilePath = path.resolve(__dirname, '../../../Backend/env_variables/test/babyTracker/.env.babyTracker')

console.log(envFilePath)
module.exports = async () => {
  dotenv.config({ path: path.resolve(envFilePath) })
}
