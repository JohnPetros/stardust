import { Pencil } from '@phosphor-icons/react'
import type { RefObject } from 'react'

type Props = {
  inputRef: RefObject<HTMLInputElement | null>
  title: string
  canEditTitle: boolean
  onTitleChange: (title: string) => void
  onButtonClick: () => void
  onEditTitle: (title: string) => Promise<void>
}

export const EditableTitleView = ({
  canEditTitle,
  title,
  inputRef,
  onTitleChange,
  onButtonClick,
}: Props) => {
  return (
    <div className='flex items-center gap-2 px-6'>
      {!canEditTitle ? (
        <h1 className='semibold px-1 text-xl text-gray-100'>{title}</h1>
      ) : (
        <input
          ref={inputRef}
          className='semibold rounded-md bg-transparent px-1 text-xl text-gray-100 outline-none outline-green-700'
          value={title}
          autoFocus
          onChange={({ currentTarget }) => onTitleChange(currentTarget.value)}
        />
      )}
      {!canEditTitle && (
        <button
          type='button'
          onClick={onButtonClick}
          className='grid place-content-center p-2'
        >
          <Pencil className='text-lg text-green-500' weight='bold' />
        </button>
      )}
    </div>
  )
}
