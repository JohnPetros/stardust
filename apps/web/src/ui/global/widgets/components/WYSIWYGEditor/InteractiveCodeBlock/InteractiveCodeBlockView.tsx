import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'

import { Code } from '@/ui/global/widgets/components/Mdx/Code'

export const InteractiveCodeBlockView = ({ node, updateAttributes }: NodeViewProps) => {
  const code = typeof node.attrs.code === 'string' ? node.attrs.code : ''

  return (
    <NodeViewWrapper data-vaul-no-drag className='not-prose' contentEditable={false}>
      <Code
        code={code}
        hasAnimation={false}
        isRunnable={true}
        onChange={(nextCode) => updateAttributes({ code: nextCode })}
      />
    </NodeViewWrapper>
  )
}
