import { sendMessageToQueue } from '..'

export const sendRegisterAttemptQueue = (registerAttemptMessage: registerAttemptMessageBody) => {
  sendMessageToQueue('registerAttempt', registerAttemptMessage)
}

export interface registerAttemptMessageBody {
  emailAddress: string
  accountId: number
  isAdmin: boolean
  groupId: number
  confirmationToken: string
}
