import Joi from 'joi'
import { registerAccountRequestBody } from '../../routes/api/register'
//import * as Joi from "joi";

export const registerAccountValidationSchema = Joi.object<registerAccountRequestBody>({
  emailAddress: Joi.string().min(3).max(70).email().required(),
  password: Joi.string().min(3).required(),
  passwordAgain: Joi.ref('password'),
  creatorAccountId: Joi.required(),
  isAdmin: Joi.required(),
})
