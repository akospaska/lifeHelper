import Joi from 'joi'

import path from 'path'
const envFilePath = path.resolve(__dirname, '../../env_variables/dev/.env.services')

require('dotenv').config({ path: envFilePath })

interface servicesRoutesDetails {
  apiGatewayHost: string
  apiGatewayPort: string
  authServiceHost: string
  authServicePort: string
  groceryServicePort: string
  groceryServiceHost: string
}

const servicesRoutesDetailsSchema = Joi.object().keys({
  apiGatewayHost: Joi.required(),
  apiGatewayPort: Joi.required(),
  authServiceHost: Joi.required(),
  authServicePort: Joi.required(),
  groceryServicePort: Joi.required(),
  groceryServiceHost: Joi.required(),
})

export const validatedServicesDetails: servicesRoutesDetails = Joi.attempt(
  {
    apiGatewayHost: process.env.API_GATEWAY_HOST,
    apiGatewayPort: process.env.API_GATEWAY_PORT,
    authServiceHost: process.env.AUTH_SERVICE_HOST,
    authServicePort: process.env.AUTH_SERVICE_PORT,
    groceryServicePort: process.env.GROCERY_SERVICE_PORT,
    groceryServiceHost: process.env.GROCERY_SERVICE_HOST,
  },
  servicesRoutesDetailsSchema
)
