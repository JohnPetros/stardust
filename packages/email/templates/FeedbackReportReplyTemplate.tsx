import { Body } from '../partials/Body'
import { Box } from '../partials/Box'
import { Footer } from '../partials/Footer'
import { Header } from '../partials/Header'
import { Link } from '../partials/Link'
import { Paragraph } from '../partials/Paragraph'
import { Link as Anchor, Text } from '@react-email/components'
import { render } from '@react-email/render'
import * as React from 'react'

export type FeedbackReportReplyTemplateProps = {
  preview: string
  reply: string
  conversationUrl: string
  isClosed?: boolean
}

export const feedbackReportReplySubject = 'Nova resposta no seu feedback — StarDust'

export const FeedbackReportReplyTemplateView = ({
  preview,
  reply,
  conversationUrl,
  isClosed = false,
}: FeedbackReportReplyTemplateProps) => (
  <Body preview={preview}>
    <Header>Nova resposta no seu feedback</Header>
    <Box>
      <Paragraph>A equipe StarDust respondeu à sua mensagem:</Paragraph>
      <Paragraph>{reply || preview}</Paragraph>
      {isClosed ? (
        <Paragraph>
          Esta conversa foi encerrada. Consulte o histórico completo no StarDust.
        </Paragraph>
      ) : (
        <Paragraph>
          Para continuar a conversa, acesse o StarDust. Este endereço não recebe
          respostas.
        </Paragraph>
      )}
      <Link href={conversationUrl}>Abrir conversa</Link>
      <Text className='mx-0 mb-5 mt-0 text-sm leading-6 text-gray-400'>
        Se o botão não funcionar, copie e cole este link no navegador:{' '}
        <Anchor href={conversationUrl} className='break-all text-green-400'>
          {conversationUrl}
        </Anchor>
      </Text>
    </Box>
    <Footer>Você recebeu este e-mail por ter enviado um feedback à StarDust.</Footer>
  </Body>
)

export const FeedbackReportReplyTemplateRender = (
  props: FeedbackReportReplyTemplateProps,
) => {
  return {
    generateHtml() {
      return render(React.createElement(FeedbackReportReplyTemplateView, props))
    },
  }
}

export const FeedbackReportReplyTemplate = FeedbackReportReplyTemplateView

export default FeedbackReportReplyTemplateView
