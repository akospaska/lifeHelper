import Joi from 'joi'
import { globalJoiOptions } from '../../utils/joi'

//------ get children  ------//
const getChildrenRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().required(),
})

export const getValidatedGetChildrenRequestBody = (requestBody: getChildrenRequestBodyType) => {
  const validatedRequestBody: getChildrenRequestBodyType = Joi.attempt(
    requestBody,
    getChildrenRequestBodySchema,
    globalJoiOptions
  )

  return validatedRequestBody
}

export interface getChildrenRequestBodyType {
  accountId: number
}
//------ ------------ ------//

//------ update child  ------//

const updateChildrenRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().integer().positive().required(),
  childId: Joi.number().integer().positive().required(),
  name: Joi.string().required(),
  isDefault: Joi.boolean().required(),
})

export const getValidatedUpdateChildRequestBody = (requestBody: updateChildrenRequestBodyType) => {
  const validatedRequestBody: updateChildrenRequestBodyType = Joi.attempt(
    requestBody,
    updateChildrenRequestBodySchema,
    globalJoiOptions
  )

  return validatedRequestBody
}

export interface updateChildrenRequestBodyType {
  accountId: number
  childId: number
  name: string
  isDefault: boolean
}
//------ ------------ ------//

//------ remove child  ------//

const removeChildrenRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().integer().positive().required(),
  childId: Joi.number().integer().positive().required(),
})

export const getValidatedRemoveChildRequestBody = (requestBody: removeChildrenRequestBodyType) => {
  const validatedRequestBody: removeChildrenRequestBodyType = Joi.attempt(
    requestBody,
    removeChildrenRequestBodySchema,
    globalJoiOptions
  )

  return validatedRequestBody
}

export interface removeChildrenRequestBodyType {
  accountId: number
  childId: number
}
//------ ------------ ------//
