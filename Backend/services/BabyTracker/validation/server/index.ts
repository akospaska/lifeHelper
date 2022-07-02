import Joi from 'joi'

const serverVariablesSchema = Joi.object().keys({
  port: Joi.required(),
  host: Joi.required(),
  timeDifferentGmt: Joi.number().positive().integer().required(),
})

export const validatedServerVariables: serverVariables = Joi.attempt(
  {
    port: process.env.BABY_TRACKER_SERVICE_PORT,
    host: process.env.BABY_TRACKER_SERVICE_HOST,
    timeDifferentGmt: Number(process.env.BABY_TRACKER_GMT_TIME_DIFFERENT_IN_SECONDS),
  },
  serverVariablesSchema
)

interface serverVariables {
  port: string
  host: string
  timeDifferentGmt: number
}

interface mysqlEnvironmentariables {
  client: string
  connection: {
    host: string
    port: string
    user: string
    password: string
    database: string
  }
}

const sqlEnvironmentVariablesSchema = Joi.object().keys({
  client: Joi.required(),
  connection: {
    host: Joi.required(),
    port: Joi.required(),
    user: Joi.required(),
    password: Joi.required(),
    database: Joi.required(),
  },
})

export const validatedSqlConnectionVariables: mysqlEnvironmentariables = Joi.attempt(
  {
    client: process.env.BABY_TRACKER_SQL_CLIENT,
    connection: {
      host: process.env.BABY_TRACKER_SQL_HOST,
      port: process.env.BABY_TRACKER_SQL_PORT,
      user: process.env.BABY_TRACKER_SQL_USER,
      password: process.env.BABY_TRACKER_SQL_PASSWORD,
      database: process.env.BABY_TRACKER_SQL_DATABASE,
    },
  },
  sqlEnvironmentVariablesSchema
)
