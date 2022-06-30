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
//-------update statistic ------//
const updateStatisticTyeSchema = Joi.object().keys({
  accountId: Joi.number().positive().integer().required(),
  statisticId: Joi.number().positive().integer().required(),
  startTime: Joi.number().positive().integer().required(),
  endTime: Joi.number().positive().integer().required(),
  comment: Joi.string(),
})

export const getValidatedUpdateStatisticRequestBody = (requestBody: updateStatisticTypeRequestBodyType) => {
  const validatedRequestBody: updateStatisticTypeRequestBodyType = Joi.attempt(
    requestBody,
    updateStatisticTyeSchema,
    globalJoiOptions
  )

  return validatedRequestBody
}

export interface updateStatisticTypeRequestBodyType {
  accountId: number
  statisticId: number
  startTime: number
  endTime: number
  comment: string
}
//------ ------------ ------//

//-------update statistic ------//
const deleteStatisticTypeSchema = Joi.object().keys({
  accountId: Joi.number().positive().integer().required(),
  statisticId: Joi.number().positive().integer().required(),
})

export const getValidatedDeleteStatisticRequestBody = (requestBody: deleteStatisticRequestBodyType) => {
  const validatedRequestBody: deleteStatisticRequestBodyType = Joi.attempt(
    requestBody,
    deleteStatisticTypeSchema,
    globalJoiOptions
  )

  return validatedRequestBody
}

export interface deleteStatisticRequestBodyType {
  accountId: number
  statisticId: number
}
//------ ------------ ------//
