import { Body } from '../components/Body'
import { Box } from '../components/Box'
import { Header } from '../components/Header'
import { Link } from '../components/Link'
import { Paragraph } from '../components/Paragraph'
import { render } from '@react-email/render'

export type FeedbackReportReplyTemplateProps = {
  preview: string
  reply: string
  conversationUrl: string
  isClosed?: boolean
}

export const feedbackReportReplySubject = 'Resposta enviada — StarDust'

export const FeedbackReportReplyTemplate = ({
  preview,
  reply,
  conversationUrl,
  isClosed = false,
}: FeedbackReportReplyTemplateProps) => (
  <Body>
    <Header>Resposta enviada</Header>
    <Box>
      <Paragraph>Recebemos uma nova resposta da equipe StarDust:</Paragraph>
      <Paragraph>{reply || preview}</Paragraph>
      {isClosed ? (
        <Paragraph>
          Este reporte foi encerrado. Você pode consultar toda a conversa no StarDust.
        </Paragraph>
      ) : (
        <Paragraph>
          Continue a conversa pelo StarDust. Este endereço não recebe respostas.
        </Paragraph>
      )}
      <Link href={conversationUrl}>Ver conversa</Link>
    </Box>
  </Body>
)

export const feedbackReportReplyText = (props: FeedbackReportReplyTemplateProps) =>
  [
    'Resposta enviada',
    '',
    props.reply || props.preview,
    '',
    props.isClosed
      ? 'Este reporte foi encerrado. Consulte toda a conversa no StarDust.'
      : 'Continue a conversa pelo StarDust. Este endereço não recebe respostas.',
    props.conversationUrl,
  ].join('\n')

export const renderFeedbackReportReplyEmail = async (
  props: FeedbackReportReplyTemplateProps,
) => render(<FeedbackReportReplyTemplate {...props} />)

export default FeedbackReportReplyTemplate
