import Joi from 'joi'
//import * as Joi from "joi";

import { loginRequestBody } from '../../../interfaces/Auth/Login'

export const loginRequestBodySchema = Joi.object<loginRequestBody>({
  email: Joi.string().min(3).max(70).email().required(),
  password: Joi.string().min(3).required(),
})
