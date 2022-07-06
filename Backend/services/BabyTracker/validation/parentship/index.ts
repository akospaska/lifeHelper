import Joi from 'joi'
import { globalJoiOptions } from '../../utils/joi'

//-------checkParentShipStatus  ------//
const getCheckParentShipStatusRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().positive().integer().required(),
})

export const getValidatedCheckParentShipRequestBody = (requestBody: getCheckParentShipStatusRequestBodyType) => {
  const validatedRequestBody: getCheckParentShipStatusRequestBodyType = Joi.attempt(
    requestBody,
    getCheckParentShipStatusRequestBodySchema,
    globalJoiOptions
  )

  return validatedRequestBody
}

export interface getCheckParentShipStatusRequestBodyType {
  accountId: number
}
//------ ------------ ------//
