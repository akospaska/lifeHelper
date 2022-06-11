import { rabbitMqChannel } from '../../rabbitMq'

import { sendEmail } from '..'
import { validatedEnvironmentVariables } from '../../server'

export const registerAttemptSubscription = () => {
  var queueName = 'registerAttempt'

  rabbitMqChannel.assertQueue(queueName, {
    durable: true,
  })

  console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queueName)

  listenNewQueue(queueName, consumeRegisterAttemptQueueMessage)
}

const consumeRegisterAttemptQueueMessage = async function (msg) {
  console.log(' [x] Received %s', msg.content.toString())

  const emailSendingQueueMessage: registerAttemptMessageBody = JSON.parse(msg.content.toString())

  const { emailAddress, confirmationToken } = emailSendingQueueMessage

  const { publicHost } = validatedEnvironmentVariables

  await sendEmail(
    emailAddress,
    'register confirmation',
    `<h1>Account registration confirmation</h1><ul>
        <a href="http://${publicHost}/api/auth/registerconfirmation?token=${confirmationToken}">Click to confirm your registration</a>
        `
  )
}
//
export const listenNewQueue = (queName: string, consumeQueue, noAck: boolean = true) => {
  rabbitMqChannel.consume(
    queName,
    async function (msg) {
      consumeQueue(msg)
    },
    {
      noAck: noAck,
    }
  )
}

interface registerAttemptMessageBody {
  emailAddress: string
  accountId: number
  isAdmin: boolean
  groupId: number
  confirmationToken: string
}

export const forgotPasswordSubscription = () => {
  var queueName = 'forgotPasswordRequest'

  rabbitMqChannel.assertQueue(queueName, {
    durable: true,
  })

  console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queueName)

  listenNewQueue(queueName, consumeForgotPasswordRequestQueueMessage)
}

const consumeForgotPasswordRequestQueueMessage = async function (msg) {
  console.log(' [x] Received %s', msg.content.toString())

  const emailSendingQueueMessage: forgotPasswordMessageBody = JSON.parse(msg.content.toString())

  const { emailAddress, emailTopic, forgotPasswordToken } = emailSendingQueueMessage

  const { apiGatewayHost, apiGatewayPort } = validatedEnvironmentVariables

  await sendEmail(
    emailAddress,
    emailTopic,
    `<h1>Forgot Password Request</h1><ul>
        <li>emailAddress:${emailAddress}</li>
        <a href="http://${apiGatewayHost}:${apiGatewayPort}/api/auth/forgotpasswordconfirmation?token=${forgotPasswordToken}">Click to confirm your forgot Password request</a>
        `
  )
}

export interface forgotPasswordMessageBody {
  emailTopic: string
  emailAddress: string
  accountId: number
  forgotPasswordToken: string
}
