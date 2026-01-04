import { AssistantMessage } from '../AssistantMessage'

type Props = {
  parts: string[]
}

export const AssistantResponse = ({ parts }: Props) => {
  return <AssistantMessage isThinking={false}>{parts.join(' ')}</AssistantMessage>
}
