import { Resend } from 'resend'

import { Email, IEmailProvider } from '@/providers/interfaces/IEmailProvider'

const API_KEY = process.env.RESEND_API_KEY

if (!API_KEY) throw new Error('Resend API key must be provided')

const resend = new Resend(API_KEY)

export const resendProvider: IEmailProvider = {
  async send(email: Email) {
    const { error } = await resend.emails.send({
      from: email.sender,
      to: email.recipient,
      html: email.template,
      subject: email.subject,
    })

    if (error?.message) throw new Error(error.message)
  },
}
