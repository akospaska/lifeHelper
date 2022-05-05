import Joi from 'joi'
import { changePasswordAfterForgotPasswordRequestBody } from '../../routes/api/changePasswordAfterForgotPasswordRequest'
//import * as Joi from "joi";

export const changePasswordAfterForgotPasswordRequestSchema = Joi.object<changePasswordAfterForgotPasswordRequestBody>({
  emailAddress: Joi.string().min(3).max(70).email().required(),
  password: Joi.string().min(3).required(),
  passwordAgain: Joi.ref('password'),
  forgotPasswordToken: Joi.required(),
})
