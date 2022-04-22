require('dotenv').config()

import Joi from 'joi'

const processTypeValidationSchema = Joi.object().keys({
  procesType: Joi.string().required().min(3),
})

Joi.attempt({ procesType: process.env.PROCESS_TYPE }, processTypeValidationSchema)

//joi validation

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
