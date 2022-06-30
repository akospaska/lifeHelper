import Joi from 'joi'
import { globalJoiOptions } from '../../utils/joi'

//------ Get Action Statuses ------//
const getActionStatusesRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().positive().integer().required(),
  childId: Joi.number().positive().integer().required(),
})

export const getValidatedGetActionsRequestBody = (requestBody: getActionStatusesRequestBodyType) => {
  const validatedRequestBody: getActionStatusesRequestBodyType = Joi.attempt(
    requestBody,
    getActionStatusesRequestBodySchema,
    globalJoiOptions
  )
  return validatedRequestBody
}

export interface getActionStatusesRequestBodyType {
  accountId: number
  childId: number
}
//------ ------------ ------//

//------ record actions automatically ------//
const recordActionsAutomaticallyRequestSchema = Joi.object().keys({
  accountId: Joi.number().positive().integer().required(),
  childId: Joi.number().positive().integer().required(),
  actionId: Joi.number().positive().integer().required(),
})

export const getValidatedRecordActionsAutomaticallyRequestBody = (
  requestBody: getValidatedRecordActionsAutomaticallyType
) => {
  const validatedRequestBody: getValidatedRecordActionsAutomaticallyType = Joi.attempt(
    requestBody,
    recordActionsAutomaticallyRequestSchema,
    globalJoiOptions
  )
  return validatedRequestBody
}

export interface getValidatedRecordActionsAutomaticallyType {
  accountId: number
  childId: number
  actionId: number
}
//------ ------------ ------//

//------ stop action recording ------//
const stopActionRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().positive().integer().required(),
  childId: Joi.number().positive().integer().required(),
  incrementedActionId: Joi.number().positive().integer().required(),
})

export const getValidatedStopActionRequestBody = (requestBody: stopActionRequestBodyType) => {
  const validatedRequestBody: stopActionRequestBodyType = Joi.attempt(
    requestBody,
    stopActionRequestBodySchema,
    globalJoiOptions
  )

  return validatedRequestBody
}

export interface stopActionRequestBodyType {
  accountId: number
  childId: number
  incrementedActionId: number
}
//------ ------------ ------//
