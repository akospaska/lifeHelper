import Joi from 'joi'
import { registerConfirmationRequestBody } from '../../routes/api/registerConfirmation'
//import * as Joi from "joi";

export const registerConfirmationSchema = Joi.object<registerConfirmationRequestBody>({
  token: Joi.string().length(128).required(),
})
