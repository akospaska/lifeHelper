import { sendMessageToQueue } from '..'

export const sendForgotRequestQueue = (registerAttemptMessage: forgotPasswordMessageBody) => {
  sendMessageToQueue('forgotPasswordRequest', registerAttemptMessage)
}

export interface forgotPasswordMessageBody {
  emailTopic: string
  emailAddress: string
  accountId: number
  forgotPasswordToken: string
}
