import Joi from 'joi'
//import * as Joi from "joi";

import { forgotPasswordRequestRequestBody } from '../../routes/api/forgotPasswordRequest'

export const forgotPasswordRequestRequestBodySchema = Joi.object<forgotPasswordRequestRequestBody>({
  email: Joi.string().min(3).max(70).email().required(),
})
