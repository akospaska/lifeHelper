import path from 'path'

const envFilePath = path.resolve(__dirname, '../env_variables/dev/auth/.env.auth')

require('dotenv').config({ path: envFilePath })

import Joi from 'joi'

const processTypeValidationSchema = Joi.object().keys({
  processType: Joi.string().required().min(3),
})

Joi.attempt({ processType: process.env.PROCESS_TYPE }, processTypeValidationSchema)

switch (process.env.PROCESS_TYPE) {
  case 'web':
    ////////////
    require('./web/index')
    break
  case 'cron':
    require('./cron/index')
    ////////////
    break
  case 'worker':
    require('./worker/index')
    ////////////
    break
}
