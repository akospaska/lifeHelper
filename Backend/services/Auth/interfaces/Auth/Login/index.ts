import { joiErrorDetail } from '../../Joi/index'

export interface loginRequestBody {
  email: string
  password: string
}

export interface loginResponse {
  accesGranted: boolean
  errorMessage: null | string
  error: null | joiErrorDetail[]
  hashValue: string
  isAdmin: boolean
  groupId: number
}
