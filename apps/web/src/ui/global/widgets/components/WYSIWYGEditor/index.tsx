'use client'

import { EditorContent } from '@tiptap/react'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useWYSIWYGEditor } from './useWYSIWYGEditor'

type Props = {
  value: string
  disabled?: boolean
  onChange: (markdown: string) => void
}

export const WYSIWYGEditor = ({ value, disabled = false, onChange }: Props) => {
  const { editor, runEditorCommand } = useWYSIWYGEditor({
    value,
    disabled,
    onChange,
  })

  const toolButtonClassName =
    'rounded-md border border-transparent px-2 py-1 text-xs font-semibold text-gray-300 transition-colors hover:border-emerald-500/20 hover:bg-[#273232]'

  const activeToolButtonClassName = 'border-emerald-400/40 bg-[#0e1a17] text-emerald-300'

  return (
    <div
      data-vaul-no-drag
      className='rounded-2xl border border-[#303030] bg-[#1e2626] p-4'
    >
      <div className='mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-[#303030] bg-[#11191a] p-2'>
        <button
          type='button'
          disabled={!editor || disabled}
          onMouseDown={runEditorCommand(() => editor?.chain().focus().toggleBold().run())}
          className={`${toolButtonClassName} ${editor?.isActive('bold') ? activeToolButtonClassName : ''}`}
          aria-label='Negrito'
        >
          B
        </button>
        <button
          type='button'
          disabled={!editor || disabled}
          onMouseDown={runEditorCommand(() =>
            editor?.chain().focus().toggleItalic().run(),
          )}
          className={`${toolButtonClassName} italic ${editor?.isActive('italic') ? activeToolButtonClassName : ''}`}
          aria-label='Italico'
        >
          I
        </button>
        <button
          type='button'
          disabled={!editor || disabled}
          onMouseDown={runEditorCommand(() => editor?.chain().focus().toggleCode().run())}
          className={`${toolButtonClassName} font-mono ${editor?.isActive('code') ? activeToolButtonClassName : ''}`}
          aria-label='Codigo inline'
        >
          {'</>'}
        </button>
        <button
          type='button'
          disabled={!editor || disabled}
          onMouseDown={runEditorCommand(() =>
            editor
              ?.chain()
              .focus()
              .insertContent({ type: 'interactiveCodeBlock', attrs: { code: '' } })
              .run(),
          )}
          className={`${toolButtonClassName} font-mono ${editor?.isActive('interactiveCodeBlock') ? activeToolButtonClassName : ''}`}
          aria-label='Bloco de codigo'
        >
          {'{ }'}
        </button>
        <button
          type='button'
          disabled={!editor || disabled}
          onMouseDown={runEditorCommand(() =>
            editor?.chain().focus().toggleBulletList().run(),
          )}
          className={`${toolButtonClassName} ${editor?.isActive('bulletList') ? activeToolButtonClassName : ''}`}
          aria-label='Lista com marcadores'
        >
          <Icon name='unordered-list' size={16} />
        </button>
        <button
          type='button'
          disabled={!editor || disabled}
          onMouseDown={runEditorCommand(() =>
            editor?.chain().focus().toggleOrderedList().run(),
          )}
          className={`${toolButtonClassName} ${editor?.isActive('orderedList') ? activeToolButtonClassName : ''}`}
          aria-label='Lista numerada'
        >
          <Icon name='ordered-list' size={16} />
        </button>
      </div>
      <EditorContent
        editor={editor}
        data-vaul-no-drag
        className='min-h-64 text-base text-gray-100 [&_.ProseMirror]:min-h-80 [&_.ProseMirror]:select-text [&_.ProseMirror]:outline-none [&_.ProseMirror_h1]:text-xl [&_.ProseMirror_h1]:font-semibold [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h3]:text-base [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_li]:my-1 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-[#0b0e0f] [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:text-emerald-300 [&_.ProseMirror_pre]:rounded-xl [&_.ProseMirror_pre]:bg-[#0b0e0f] [&_.ProseMirror_pre]:p-3 [&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-500 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]'
      />
    </div>
  )
}
