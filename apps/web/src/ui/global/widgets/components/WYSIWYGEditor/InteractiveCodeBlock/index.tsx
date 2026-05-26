import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { InteractiveCodeBlockView } from './InteractiveCodeBlockView'

export const InteractiveCodeBlock = Node.create({
  name: 'interactiveCodeBlock',

  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,
  isolating: true,

  addAttributes() {
    return {
      code: {
        default: '',
        parseHTML: (element) => element.textContent ?? '',
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'pre[data-type="interactive-code-block"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(HTMLAttributes, { 'data-type': 'interactive-code-block' }),
      ['code', HTMLAttributes.code ?? ''],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(InteractiveCodeBlockView)
  },
})
