import type { FeedbackReportReplyTemplateProps } from '@stardust/email/templates'

export class FeedbackReportReplyEmailService {
  createText(props: FeedbackReportReplyTemplateProps): string {
    return [
      'Nova resposta no seu feedback — StarDust',
      '',
      'A equipe StarDust respondeu à sua mensagem:',
      '',
      props.reply || props.preview,
      '',
      props.isClosed
        ? 'Esta conversa foi encerrada. Consulte o histórico completo no StarDust.'
        : 'Para continuar a conversa, acesse o StarDust. Este endereço não recebe respostas.',
      '',
      props.conversationUrl,
    ].join('\n')
  }
}
