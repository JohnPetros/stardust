'use client'

import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import { useEffect, type MouseEvent } from 'react'
import type { Editor } from '@tiptap/core'

type Params = {
  value: string
  disabled?: boolean
  onChange: (markdown: string) => void
}

export function useTiptapEditorField({ value, disabled = false, onChange }: Params) {
  function runEditorCommand(command: () => void) {
    return (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      command()
    }
  }

  function getMarkdown(editor: Editor) {
    const editorStorage = editor.storage as unknown as Record<
      string,
      { getMarkdown?: () => string }
    >
    return editorStorage.markdown?.getMarkdown?.() ?? ''
  }

  const editor = useEditor({
    editable: !disabled,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder: 'Escreva sua anotação...' }),
      Markdown,
    ],
    content: value,
    onUpdate: ({ editor: updatedEditor }: { editor: Editor }) => {
      onChange(getMarkdown(updatedEditor))
    },
  })

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [disabled, editor])

  useEffect(() => {
    if (!editor) return
    const nextContent = value.trim()
    const currentContent = getMarkdown(editor).trim()

    if (nextContent !== currentContent) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return {
    editor,
    disabled,
    runEditorCommand,
  }
}
