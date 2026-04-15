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

const buildMdxBlock = (block: Block) => {
  if (block.type === 'normal-text') return `\n${block.content}`

  if (block.type === 'Code') return `<Code exec>${block.content}</Code>`

  return `<${block.type}>\n${block.content}\n</${block.type}>`
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
    <div className='mt-6'>
      <Icon className='text-green-400' name='robot' weight='normal' size={36} />
      <div className='-translate-y-3'>
        {isThinking && (
          <div className='mt-4'>
            <Animation name='hourglass' size={80} hasLoop />
          </div>
        )}
        {!isThinking &&
          blocks.map((block, index) => (
            <Mdx key={`${block.type}-${index}`}>{buildMdxBlock(block)}</Mdx>
          ))}
      </div>
    </div>
  )
}
