import { validatedEnvironmentVariables } from '../server'

const { emailKey1, emailKey2 } = validatedEnvironmentVariables

const mailjet = require('node-mailjet').connect(emailKey1, emailKey2)

export const sendEmail = async (toEmail, subject, htmlText) => {
  const emailSendingResponse = await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'brutalbracsa@gmail.com',
          Name: 'Akos Paska',
        },
        To: [
          {
            Email: toEmail,
            Name: '',
          },
        ],
        Subject: subject,
        TextPart: '',
        HTMLPart: htmlText,
        CustomID: 'AppGettingStartedTest',
      },
    ],
  })

  const emailSendingResults: emailSendingResult[] = emailSendingResponse.body

  return emailSendingResults
}

interface emailSendingResult {
  Status: string
  CustomId: string
  to: string[]
  cc: string[]
  Bcc: string[]
}
