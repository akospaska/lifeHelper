import Joi from 'joi'
import { globalJoiOptions } from '../../utils/joi'

const getChildrenRequestBodySchema = Joi.object().keys({
  accountId: Joi.required(),
})

export const getValidatedGetChildrenRequestBody = (requestBody: getChildrenRequestBodyType) => {
  const validatedAccountId: getChildrenRequestBodyType = Joi.attempt(
    requestBody,
    getChildrenRequestBodySchema,
    globalJoiOptions
  )

  return validatedAccountId
}

export interface getChildrenRequestBodyType {
  accountId: number
}
