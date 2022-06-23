import Joi from 'joi'
import { globalJoiOptions } from '../../utils/joi'

const getActionStatusesRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().required(),
  childId: Joi.number().required(),
})

export const getValidatedGetActionsRequestBody = (requestBody: getActionStatusesRequestBodyType) => {
  const validatedAccountId: getActionStatusesRequestBodyType = Joi.attempt(
    requestBody,
    getActionStatusesRequestBodySchema,
    globalJoiOptions
  )

  return validatedAccountId
}

export interface getActionStatusesRequestBodyType {
  accountId: number
  childId: number
}
