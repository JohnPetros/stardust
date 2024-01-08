import { renderTemplate } from './templates/components/renderTemplate'
import { RequestPasswordReset } from './templates/RequestPasswordResetTemplate'
import { META_DATA } from './metaData'

import { EmailProvider } from '@/@types/emailProvider'

export function authEmails(emailProvider: EmailProvider) {
  return {
    sendRequestPasswordResetEmail: async (recipient: string) => {
      emailProvider.send({
        sender: META_DATA.sender,
        recipient,
        subject: 'Pedido de redefinição de senha',
        // template: renderTemplate(RequestPasswordReset, {
        //   passwordToken: 'token',
        // }),
        template: '<h1>Teste de e-mail</h1>',
      })
    },
  }
}
