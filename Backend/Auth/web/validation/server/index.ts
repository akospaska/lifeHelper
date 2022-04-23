import Joi from 'joi'

const webProcessServerVariablesSchema = Joi.object().keys({
  port: Joi.required(),
  host: Joi.required(),
  redisHost: Joi.required(),
  redisPort: Joi.required(),
})

export const validatedWebProcessServerVariables: webProcessServerVariables = Joi.attempt(
  {
    port: process.env.AUTH_WEB_PORT,
    host: process.env.AUTH_WEB_HOST,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
  },
  webProcessServerVariablesSchema
)

interface webProcessServerVariables {
  port: string
  host: string
  redisHost: string
  redisPort: string
}
