import Joi from 'joi'
//import * as Joi from "joi";

import { identifyRequestBody } from '../../routes/api/me'

export const identifyRequestBodySchema = Joi.object<identifyRequestBody>({
  sessionKey: Joi.string().length(24).required(),
})
