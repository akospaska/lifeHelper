import Joi from 'joi'
import { globalJoiOptions } from '../../utils/joi'

//------ get children  ------//
const getChildrenRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().required(),
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
//------ ------------ ------//
