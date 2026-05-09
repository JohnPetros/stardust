'use client'

import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import { useEffect, useRef, type MouseEvent } from 'react'
import type { Editor, JSONContent } from '@tiptap/core'

type Params = {
  value: string
  disabled?: boolean
  onChange: (markdown: string) => void
}

function normalizeEditorMarkdown(markdown: string) {
  return markdown.replace(/\u00A0/g, ' ').replace(/\r\n/g, '\n')
}

function applyMarks(text: string, marks: JSONContent['marks'] = []) {
  return marks.reduce((markedText, mark) => {
    if (mark.type === 'bold') return `**${markedText}**`
    if (mark.type === 'italic') return `_${markedText}_`
    if (mark.type === 'code') return `\`${markedText}\``
    return markedText
  }, text)
}

function serializeInlineContent(content: JSONContent[] = []): string {
  return content
    .map((node) => {
      if (node.type === 'text') {
        return applyMarks(normalizeEditorMarkdown(node.text ?? ''), node.marks)
      }

      if (node.type === 'hardBreak') return '  \n'

      return serializeInlineContent(node.content)
    })
    .join('')
}

function serializeListItem(node: JSONContent, prefix: string): string {
  const blocks = node.content ?? []
  const [firstBlock, ...remainingBlocks] = blocks
  const firstLine = serializeNode(firstBlock).replace(/\n+$/g, '')
  const nestedContent = remainingBlocks
    .map(serializeNode)
    .join('\n')
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n')

  return nestedContent
    ? `${prefix} ${firstLine}\n${nestedContent}`
    : `${prefix} ${firstLine}`
}

function serializeNode(node?: JSONContent): string {
  if (!node) return ''

  if (node.type === 'doc') {
    return (node.content ?? []).map(serializeNode).join('\n\n')
  }

  if (node.type === 'paragraph') {
    const paragraph = serializeInlineContent(node.content)
    return paragraph.trim().length > 0 ? paragraph : '<br>'
  }

  if (node.type === 'heading') {
    const level = Number(node.attrs?.level ?? 1)
    return `${'#'.repeat(level)} ${serializeInlineContent(node.content)}`
  }

  if (node.type === 'bulletList') {
    return (node.content ?? []).map((item) => serializeListItem(item, '-')).join('\n')
  }

  if (node.type === 'orderedList') {
    return (node.content ?? [])
      .map((item, index) => serializeListItem(item, `${index + 1}.`))
      .join('\n')
  }

  if (node.type === 'codeBlock') {
    return `\`\`\`\n${serializeInlineContent(node.content)}\n\`\`\``
  }

  if (node.type === 'blockquote') {
    return serializeInlineContent(node.content)
      .split('\n')
      .map((line: string) => `> ${line}`)
      .join('\n')
  }

  return serializeInlineContent(node.content)
}

export function useWYSIWYGEditor({ value, disabled = false, onChange }: Params) {
  const isSyncingContentRef = useRef(false)

  function runEditorCommand(command: () => void) {
    return (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      command()
    }
  }

  function getMarkdown(editor: Editor) {
    return serializeNode(editor.getJSON())
  }

  function setMarkdownContent(editor: Editor, markdown: string) {
    isSyncingContentRef.current = true
    const normalizedMarkdown = normalizeEditorMarkdown(markdown)

    const editorStorage = editor.storage as unknown as Record<
      string,
      { parser?: { parse?: (value: string) => unknown } }
    >

    const parsedContent = editorStorage.markdown?.parser?.parse?.(normalizedMarkdown)

    if (parsedContent) {
      editor.commands.setContent(parsedContent)
      isSyncingContentRef.current = false
      return
    }

    editor.commands.setContent(normalizedMarkdown)
    isSyncingContentRef.current = false
  }

  const editor = useEditor({
    editable: !disabled,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder: 'Escreva sua anotação...' }),
      Markdown.configure({
        breaks: true,
      }),
    ],
    content: '',
    onCreate: ({ editor: createdEditor }: { editor: Editor }) => {
      setMarkdownContent(createdEditor, value)
    },
    onUpdate: ({ editor: updatedEditor }: { editor: Editor }) => {
      if (isSyncingContentRef.current) return
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
      setMarkdownContent(editor, value)
    }
  }, [value, editor])

  return {
    editor,
    disabled,
    runEditorCommand,
  }
}
