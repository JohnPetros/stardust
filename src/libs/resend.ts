import { Resend } from 'resend'

import { Email, EmailProvider } from '@/@types/emailProvider'

const API_KEY = process.env.RESEND_API_KEY

if (!API_KEY) throw new Error('Resend API key must be provided')

const resend = new Resend(API_KEY)

export const resendProvider: EmailProvider = {
  async send(email: Email) {
    resend.emails.send({
      from: email.sender,
      to: email.recipient,
      html: email.template,
      subject: email.subject,
    })
  },
}
