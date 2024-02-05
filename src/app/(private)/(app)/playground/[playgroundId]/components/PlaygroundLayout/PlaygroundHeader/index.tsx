'use client'

import { ArrowLeft, Pencil } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'

import { usePlaygroundHeader } from './usePlaygroundHeader'

type HeaderProps = {
  playgroundId: string
  playgroundTitle: string
  height: number
}

export function PlaygroundHeader({
  playgroundId,
  playgroundTitle,
  height,
}: HeaderProps) {
  const {
    title,
    inputRef,
    canEditTitle,
    handleCanEditTitle,
    handleTitleChange,
    handleKeyup,
  } = usePlaygroundHeader(playgroundId, playgroundTitle)

  const router = useRouter()

  return (
    <header
      style={{ height }}
      className="flex items-center border-b p-3 md:border-green-700"
    >
      <div className="flex items-center gap-2 px-6">
        <button onClick={router.back} className="-translate-x-2 p-2">
          <ArrowLeft className="text-xl text-green-500" weight="bold" />
        </button>
        {!canEditTitle ? (
          <h1 className="semibold px-1 text-xl text-gray-100">{title}</h1>
        ) : (
          <input
            ref={inputRef}
            className="semibold rounded-md bg-transparent px-1 text-xl text-gray-100 outline-none outline-green-700"
            value={title}
            autoFocus
            onKeyUp={handleKeyup}
            onChange={({ currentTarget }) =>
              handleTitleChange(currentTarget.value)
            }
          />
        )}
        {!canEditTitle && (
          <button
            onClick={handleCanEditTitle}
            className="grid place-content-center p-2"
          >
            <Pencil className="text-lg text-green-500" weight="bold" />
          </button>
        )}
      </div>
    </header>
  )
}
