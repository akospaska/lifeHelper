import Joi from 'joi'

const webProcessServerVariablesSchema = Joi.object().keys({
  port: Joi.required(),
  host: Joi.required(),
  authHost: Joi.required(),
  authPort: Joi.required(),
  groceryHost: Joi.required(),
  groceryPort: Joi.required(),
})

export const validatedWebProcessServerVariables: webProcessServerVariables = Joi.attempt(
  {
    port: process.env.API_GATEWAY_PORT,
    host: process.env.API_GATEWAY_HOST,
    authHost: process.env.AUTH_SERVICE_HOST,
    authPort: process.env.AUTH_SERVICE_PORT,
    groceryHost: process.env.GROCERY_SERVICE_HOST,
    groceryPort: process.env.GROCERY_SERVICE_PORT,
  },
  webProcessServerVariablesSchema
)

interface webProcessServerVariables {
  port: string
  host: string
  authHost: string
  authPort: string
  groceryHost: string
  groceryPort: string
}
