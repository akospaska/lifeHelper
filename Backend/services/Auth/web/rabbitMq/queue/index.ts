import { rabbitMqConnection } from '../'
export let rabbitmqchannel

export const sendMessageToQueue = (queueName: string, messageObject: any) => {
  rabbitMqConnection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1
    }

    rabbitmqchannel = channel
    var queue = queueName
    var msg = messageObject

    channel.assertQueue(queue, {
      durable: true,
    })

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)))
    console.log(`${queueName} has been sent to the worker MODIFIED`)
  })
}
