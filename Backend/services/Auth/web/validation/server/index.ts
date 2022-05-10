import Joi from 'joi'

const webProcessServerVariablesSchema = Joi.object().keys({
  port: Joi.required(),
  host: Joi.required(),
  redisHost: Joi.required(),
  redisPort: Joi.required(),
  passwordSaltKey: Joi.required(),
  rabbitMqHost: Joi.required(),
  nodeEnv: Joi.string().length(3).required(),
})

export const validatedWebProcessServerVariables: webProcessServerVariables = Joi.attempt(
  {
    port: process.env.AUTH_WEB_PORT,
    host: process.env.AUTH_WEB_HOST,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    passwordSaltKey: process.env.PASSWORD_SALT_KEY,
    rabbitMqHost: process.env.AUTH_WEB_RABBITMQ_HOST,
    nodeEnv: process.env.NODE_ENV,
  },
  webProcessServerVariablesSchema
)

interface webProcessServerVariables {
  port: string
  host: string
  redisHost: string
  redisPort: string
  passwordSaltKey: string
  rabbitMqHost: string
  nodeEnv: string
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

const mongoDbEnvironmentVariablesSchema = Joi.object().keys({
  mongoDbHost: Joi.required(),
  mongoDbPort: Joi.required(),
})

export const validatedMongoDbEnvironmentVariables: validatedMongoDbEnvironmentVariables = Joi.attempt(
  {
    mongoDbHost: process.env.AUTH_MONGODB_HOST,
    mongoDbPort: process.env.AUTH_MONGODB_PORT,
  },
  mongoDbEnvironmentVariablesSchema
)

interface validatedMongoDbEnvironmentVariables {
  mongoDbHost: string
  mongoDbPort: string
}
