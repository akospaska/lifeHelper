import Joi from 'joi'
import { deleteChildWeightType, getChildWeightsType, insertChildWeightType, updateChildWeightType } from '../../facade/childWeight'
import { globalJoiOptions } from '../../utils/joi'

const getChildWeightsBodySchema = Joi.object().keys({
  accountId: Joi.number().integer().positive().required(),
  childId: Joi.number().integer().positive().required(),
  pagerStart: Joi.number().required(),
  pagerEnd: Joi.number().required(),
})

export const getValidatedGetChildWeightsRequestBody = (requestBody: getChildWeightsType) => {
  const validatedRequestBody: getChildWeightsType = Joi.attempt(requestBody, getChildWeightsBodySchema, globalJoiOptions)

  return validatedRequestBody
}

const insertChildWeightBodySchema = Joi.object().keys({
  accountId: Joi.number().integer().positive().required(),
  date: Joi.number().integer().positive().required(),
  childId: Joi.number().integer().positive().required(),
  weight: Joi.number().integer().positive().required(),
  comment: Joi.string().optional().allow(null).allow('').empty(''),
})

export const getValidatedInsertChildWeightRequestBody = (requestBody: insertChildWeightType) => {
  const validatedRequestBody: insertChildWeightType = Joi.attempt(requestBody, insertChildWeightBodySchema, globalJoiOptions)

  return validatedRequestBody
}

const updateChildWeightBodySchema = Joi.object().keys({
  accountId: Joi.number().integer().positive().required(),
  date: Joi.number().integer().positive().required(),
  childId: Joi.number().integer().positive().required(),
  weight: Joi.number().integer().positive().required(),
  comment: Joi.string().optional().allow(null).allow('').empty(''),
  weightId: Joi.number().integer().positive().required(),
})

export const getValidatedUpdateChildWeightRequestBody = (requestBody: updateChildWeightType) => {
  const validatedRequestBody: updateChildWeightType = Joi.attempt(requestBody, updateChildWeightBodySchema, globalJoiOptions)

  return validatedRequestBody
}

const deleteChildWeightBodySchema = Joi.object().keys({
  accountId: Joi.number().integer().positive().required(),
  weightId: Joi.number().integer().positive().required(),
})

export const getValidatedDeleteChildWeightRequestBody = (requestBody: deleteChildWeightType) => {
  const validatedRequestBody: deleteChildWeightType = Joi.attempt(requestBody, deleteChildWeightBodySchema, globalJoiOptions)

  return validatedRequestBody
}
