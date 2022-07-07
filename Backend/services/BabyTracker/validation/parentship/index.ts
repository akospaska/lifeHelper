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

//-------checkParentShipStatus  ------//
const getAcceptParentInvitationRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().positive().integer().required(),
  invitationId: Joi.number().positive().integer().required(),
})

export const getValidatedAcceptInvitationRequestBody = (requestBody: acceptInvitationRequestBody) => {
  const validatedRequestBody: acceptInvitationRequestBody = Joi.attempt(
    requestBody,
    getAcceptParentInvitationRequestBodySchema,
    globalJoiOptions
  )

  return validatedRequestBody
}

export interface acceptInvitationRequestBody {
  accountId: number
  invitationId: number
}
//------ ------------ ------//

//-------invite parentship  ------//
const getInviteParentShipRequestBodySchema = Joi.object().keys({
  accountId: Joi.number().positive().integer().required(),
  consigneeAccountId: Joi.string(),
})

export const getValidatedInviteParentShipRequestBody = (requestBody: inviteParentShipRequestBodyType) => {
  const validatedRequestBody: inviteParentShipRequestBodyType = Joi.attempt(
    requestBody,
    getInviteParentShipRequestBodySchema,
    globalJoiOptions
  )

  return validatedRequestBody
}

export interface inviteParentShipRequestBodyType {
  accountId: number
  consigneeAccountId: number
}
//------ ------------ ------//
