import { validatedEnvironmentVariables } from '../server'

export let rabbitMqChannel
export let rabbitMqConnection

const { rabbitMqHost, nodeEnv } = validatedEnvironmentVariables

const rabbitMqProtocol = nodeEnv === 'prd' ? 'amqps' : 'ampq'

import { forgotPasswordSubscription, registerAttemptSubscription } from '../email/rabbitSubscription'
export const connectRabbitMq = () => {
  var amqp = require('amqplib/callback_api')

  amqp.connect(`${rabbitMqProtocol}://${rabbitMqHost}`, function (error0, connection) {
    if (error0) {
      throw error0
    }

    rabbitMqConnection = connection
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1
      }

      rabbitMqChannel = channel

      //list all of the subscriptions
      registerAttemptSubscription()
      forgotPasswordSubscription()
    })
  })
}

export const rabbitMqConnectionClose = async () => {
  await rabbitMqConnection.close()
}
