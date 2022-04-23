import Joi from 'joi'

const webProcessServerVariablesSchema = Joi.object().keys({
  port: Joi.required(),
  host: Joi.required(),
  redisHost: Joi.required(),
  redisPort: Joi.required(),
  passwordSaltKey: Joi.required(),
})

export const validatedWebProcessServerVariables: webProcessServerVariables = Joi.attempt(
  {
    port: process.env.AUTH_WEB_PORT,
    host: process.env.AUTH_WEB_HOST,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    passwordSaltKey: process.env.PASSWORD_SALT_KEY,
  },
  webProcessServerVariablesSchema
)

interface webProcessServerVariables {
  port: string
  host: string
  redisHost: string
  redisPort: string
  passwordSaltKey: string
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
    client: process.env.AUTH_SQL_CLIENT,
    connection: {
      host: process.env.AUTH_SQL_HOST,
      port: process.env.AUTH_SQL_PORT,
      user: process.env.AUTH_SQL_USER,
      password: process.env.AUTH_SQL_PASSWORD,
      database: process.env.AUTH_SQL_DATABASE,
    },
  },
  sqlEnvironmentVariablesSchema
)
