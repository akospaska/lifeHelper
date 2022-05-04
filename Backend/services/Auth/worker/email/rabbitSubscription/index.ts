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

  const { emailAddress, accountId, isAdmin, groupId, confirmationToken } = emailSendingQueueMessage

  const { apiGatewayHost, apiGatewayPort } = validatedEnvironmentVariables

  await sendEmail(
    'brutalbracsa@gmail.com',
    'register confirmation',
    `<h1>LoginReport</h1><ul>
        <li>emailAddress:${emailAddress}</li>
        <li>groupId:${groupId}</li>
        <li>accountId:${accountId}</li>
        <li>isAdmin:${isAdmin}</li></ul>
        <a href="http://${apiGatewayHost}:${apiGatewayPort}/api/auth/registerconfirmation?token=${confirmationToken}">Click to confirm your registration</a>
        `
  )
}

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
