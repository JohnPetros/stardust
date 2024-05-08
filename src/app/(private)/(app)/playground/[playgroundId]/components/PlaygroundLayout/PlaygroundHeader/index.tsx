'use client'

import { Pencil } from '@phosphor-icons/react'

import { usePlaygroundHeader } from './usePlaygroundHeader'
import { EditableTitle } from '@/global/components/EditableTitle'

type HeaderProps = {
  playgroundId: string
  playgroundTitle: string
  height: number
  hasPlayground: boolean
  onCreatePlayground: (title: string) => Promise<void>
}

export function PlaygroundHeader({
  height,
  playgroundId,
  playgroundTitle,
  hasPlayground,
  onCreatePlayground,
}: HeaderProps) {
  const {
    title,
    inputRef,
    canEditTitle,
    editPlaygroundTitle,
  } = usePlaygroundHeader({
    playgroundId,
    playgroundTitle,
    hasPlayground,
    onCreatePlayground,
  })

  return (
    <header
      style={{ height }}
      className='flex items-center border-b p-3 md:border-green-700'
    >
      {/* <div className='flex items-center gap-2 px-6'>
        {!canEditTitle ? (
          <h1 className='semibold px-1 text-xl text-gray-100'>{title}</h1>
        ) : (
          <input
            ref={inputRef}
            className='semibold rounded-md bg-transparent px-1 text-xl text-gray-100 outline-none outline-green-700'
            value={title}
            autoFocus
            onKeyUp={handleKeyup}
            onChange={({ currentTarget }) => handleTitleChange(currentTarget.value)}
          />
        )}
        {!canEditTitle && (
          <button
            type='button'
            onClick={handleCanEditTitle}
            className='grid place-content-center p-2'
          >
            <Pencil className='text-lg text-green-500' weight='bold' />
          </button>
        )}
      </div> */}
      <EditableTitle initialTitle={playgroundTitle} onEditTitle={editPlaygroundTitle} />
    </header>
  )
}
