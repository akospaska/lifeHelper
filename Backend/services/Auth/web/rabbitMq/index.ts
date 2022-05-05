import { validatedWebProcessServerVariables } from '../validation/server'

const amqp = require('amqplib/callback_api')

const { rabbitMqHost } = validatedWebProcessServerVariables
export let rabbitMqConnection

export const connectRabbitMq = async () => {
  await amqp.connect(`amqp://${rabbitMqHost}`, async function (error0, connection) {
    if (error0) {
      throw error0
    }

    rabbitMqConnection = connection
    console.log('RabbitMq Connected')
  })
}

export const closeRabbitMqConnection = async () => {
  await rabbitMqConnection.close()
  console.log('RabbitMq connection has been closed')
}

//opened queues:
/*
- registerAttempt
- forgotPasswordAttempt
*/
