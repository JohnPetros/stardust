import { Animation } from '@/ui/global/widgets/components/Animation'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Mdx } from '@/ui/global/widgets/components/Mdx'

type Props = {
  children?: string
  isThinking: boolean
}

type Block = {
  type: 'text' | 'Code'
  content: string
}

const parseStream = (rawText: string): Block[] => {
  const blocks: Block[] = []

  const regex = /<(Code)(?:\s+[^>]*)?>([\s\S]*?)(?:<\/\1>|$)/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(rawText)) !== null) {
    const plainText = rawText.substring(lastIndex, match.index)
    if (plainText.trim()) {
      blocks.push({ type: 'text', content: plainText })
    }

    blocks.push({
      type: match[1] as Block['type'],
      content: match[2],
    })

    lastIndex = regex.lastIndex
  }

  const remainingText = rawText.substring(lastIndex)
  if (remainingText.trim()) {
    blocks.push({ type: 'text', content: remainingText })
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
          blocks.map((block, index) =>
            block.type === 'Code' ? (
              <Mdx key={`${block.type}-${index}`}>{`<Code>${block.content}</Code>`}</Mdx>
            ) : (
              <Mdx key={`${block.type}-${index}`}>{block.content}</Mdx>
            ),
          )}
      </div>
    </div>
  )
}
