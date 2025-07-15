'use client'

import { useRef } from 'react'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import type { TextEditorRef } from '../../TextEditor/types'
import { useCommentInput } from './useCommentInput'
import { CommentInputView } from './CommentInputView'

type CommentInputProps = {
  id: string
  placeholder?: string
  defaultContent?: string
  title: string
  onSend: (commentContent: string) => void
}

export const CommentInput = ({
  id,
  title,
  placeholder,
  defaultContent = '',
  onSend,
}: CommentInputProps) => {
  const textEditorRef = useRef<TextEditorRef | null>(null)
  const {
    content,
    errorMessage,
    isPreviewVisible,
    handleTogglePreview,
    handleContentChange,
    handleSnippetInsert,
    handlePostComment,
  } = useCommentInput({ onSend, textEditorRef, defaultContent })
  const { user } = useAuthContext()

  if (user)
    return (
      <CommentInputView
        id={id}
        title={title}
        placeholder={placeholder}
        defaultContent={defaultContent}
        content={content}
        textEditorRef={textEditorRef}
        userAvatarImage={user?.avatar.image.value}
        userAvatarName={user?.avatar.name.value}
        errorMessage={errorMessage}
        isPreviewVisible={isPreviewVisible}
        onPost={handlePostComment}
        onTogglePreview={handleTogglePreview}
        onChange={handleContentChange}
        onSnippetInsert={handleSnippetInsert}
      />
    )
}
