import { Resend } from 'resend'

import { Email, EmailProvider } from '@/@types/emailProvider'

const resend = new Resend()

export const resendProvider: EmailProvider = {
  send(email: Email) {
    resend.emails.send({
      from: email.sender,
      to: email.recipient,
      html: email.template,
      subject: email.subject,
    })
  },
}
