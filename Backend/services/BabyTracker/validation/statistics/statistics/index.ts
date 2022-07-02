import Joi from 'joi'
import { globalJoiOptions } from '../../../utils/joi'

//------ get statistics  ------//
const getStatisticsRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().positive().integer().required(),
  statisticsTypeId: Joi.number().positive().integer().required(),
  childId: Joi.number().positive().integer().required(),
  intervallEnd: Joi.number().positive().integer().required(),
  intervallStart: Joi.number().integer().required().less(Joi.ref('intervallEnd')),
})

export const getValidatedGetStatisticsRequestBody = (requestBody: getStatisticsRequestBodyType) => {
  const validatedRequestBody: getStatisticsRequestBodyType = Joi.attempt(
    requestBody,
    getStatisticsRequestBodySchema,
    globalJoiOptions
  )

  return validatedRequestBody
}

export interface getStatisticsRequestBodyType {
  accountId: number
  statisticsTypeId: number
  childId: number
  intervallStart: number
  intervallEnd: number
}
//------ ------------ ------//

//------ get statisticTypes  ------//
const getStatisticTypesSchema = Joi.object().keys({
  accountId: Joi.number().positive().integer().required(),
})

export const getValidatedStatisticTypesRequestBody = (requestBody: getStatisticTypesRequestBodyType) => {
  const validatedRequestBody: getStatisticTypesRequestBodyType = Joi.attempt(
    requestBody,
    getStatisticTypesSchema,
    globalJoiOptions
  )

  return validatedRequestBody
}

export interface getStatisticTypesRequestBodyType {
  accountId: number
}
//------ ------------ ------//
