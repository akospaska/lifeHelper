import Joi from 'joi'
import { globalJoiOptions } from '../../../utils/joi'

//------ get children  ------//
const getStatisticsRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().positive().integer().required(),
  statisticsTypeId: Joi.number().positive().integer().required(),
  childId: Joi.number().positive().integer().required(),
  intervallEnd: Joi.number().positive().integer().required(),
  intervallStart: Joi.number().integer().required().less(Joi.ref('intervallEnd')),
})

export const getValidatedGetStatisticsRequestBody = (requestBody: getStatisticsRequestBodyType) => {
  const validatedAccountId: getStatisticsRequestBodyType = Joi.attempt(
    requestBody,
    getStatisticsRequestBodySchema,
    globalJoiOptions
  )

  return validatedAccountId
}

export interface getStatisticsRequestBodyType {
  accountId: number
  statisticsTypeId: number
  childId: number
  intervallStart: number
  intervallEnd: number
}
//------ ------------ ------//
