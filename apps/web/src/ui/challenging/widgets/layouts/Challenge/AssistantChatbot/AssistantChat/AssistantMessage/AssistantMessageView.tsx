import { Animation } from '@/ui/global/widgets/components/Animation'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Mdx } from '@/ui/global/widgets/components/Mdx'

type Props = {
  children?: string
  isThinking: boolean
}

type Block = {
  type: 'normal-text' | 'Text' | 'Code' | 'Alert' | 'Quote'
  content: string
}

const parseStream = (rawText: string): Block[] => {
  const blocks: Block[] = []

  const regex = /<(Text|Code|Alert|Quote)>([\s\S]*?)(?:<\/\1>|$)/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(rawText)) !== null) {
    const plainText = rawText.substring(lastIndex, match.index)
    if (plainText.trim()) {
      blocks.push({ type: 'Text', content: plainText })
    }

    blocks.push({
      type: match[1] as Block['type'],
      content: match[2],
    })

    lastIndex = regex.lastIndex
  }

  const remainingText = rawText.substring(lastIndex)
  if (remainingText.trim()) {
    blocks.push({ type: 'normal-text', content: remainingText })
  }

  return blocks
}

export const AssistantMessageView = ({ children, isThinking }: Props) => {
  const blocks = children ? parseStream(children) : []
  return (
    <div>
      <Icon className='text-green-400' name='robot' weight='normal' size={36} />
      <div className='mt-1'>
        {isThinking && <Animation name='hourglass' size={80} hasLoop />}
        {!isThinking &&
          blocks.map((block) => (
            <Mdx key={block.content}>
              {block.type !== 'normal-text'
                ? block.type === 'Code'
                  ? `<Code exec>${block.content}</Code>`
                  : `<${block.type}>\n${block.content}\n</${block.type}>`
                : `\n${block.content}`}
            </Mdx>
          ))}
      </div>
    </div>
  )
}
