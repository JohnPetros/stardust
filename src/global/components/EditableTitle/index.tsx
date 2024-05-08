import { Pencil } from '@phosphor-icons/react'
import { useEditableTitle } from './useEditableTitle'

type EditableTitleProps = {
  initialTitle: string
  onEditTitle: (title: string) => Promise<void>
}

export function EditableTitle({ initialTitle, onEditTitle }: EditableTitleProps) {
  const {
    title,
    inputRef,
    canEditTitle,
    handleKeyup,
    handleTitleChange,
    handleButtonClick,
  } = useEditableTitle(initialTitle, onEditTitle)

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
          onChange={({ currentTarget }) => handleTitleChange(currentTarget.value)}
        />
      )}
      {!canEditTitle && (
        <button
          type='button'
          onClick={handleButtonClick}
          className='grid place-content-center p-2'
        >
          <Pencil className='text-lg text-green-500' weight='bold' />
        </button>
      )}
    </div>
  )
}
