import { Pencil } from '@phosphor-icons/react'

import { useHeader } from './useHeader'

type HeaderProps = {
  playgroundTitle: string
}

export function Header({ playgroundTitle }: HeaderProps) {
  const { title, canEditTitle, handleCanEditTitle, handleTitleChange } =
    useHeader(playgroundTitle)

  return (
    <header className="border-b md:border-green-700">
      <div className="flex items-center gap-3">
        {canEditTitle ? (
          <h1 className="semibold text-xl text-gray-100">{title}</h1>
        ) : (
          <input
            className="semibold text-xl text-gray-100"
            value={title}
            onChange={({ currentTarget }) =>
              handleTitleChange(currentTarget.value)
            }
          />
        )}
        <button
          onClick={handleCanEditTitle}
          className="grid place-content-center p-2"
        >
          <Pencil className="text-lg text-green-400" weight="bold" />
        </button>
      </div>
    </header>
  )
}
