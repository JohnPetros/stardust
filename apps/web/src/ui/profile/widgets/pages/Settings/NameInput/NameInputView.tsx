type Props = {
  value: string
  isEditing: boolean
  onChange: (value: string) => void
  onEditButtonClick: () => void
  onSaveButtonClick: () => void
  onCancelButtonClick: () => void
}

export const NameInputView = ({
  value,
  isEditing,
  onChange,
  onEditButtonClick,
  onSaveButtonClick,
  onCancelButtonClick,
}: Props) => {
  return (
    <div className='grid grid-cols-3 border-b border-gray-700 py-4'>
      <label htmlFor='name' className='text-sm text-gray-100'>
        Nome
      </label>

      {!isEditing && (
        <input
          type='text'
          className='text-gray-400 bg-transparent border-none outline-none'
          value={value}
          readOnly
        />
      )}

      {isEditing && (
        <input
          type='text'
          className='text-gray-400 bg-transparent border-none outline-none'
          value={value}
          autoFocus
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      <div className='flex justify-end gap-2'>
        {isEditing && (
          <div className='flex flex-col items-center'>
            <button
              type='button'
              onClick={onSaveButtonClick}
              className='text-sm text-green-400'
            >
              Salvar
            </button>
            <button
              type='button'
              onClick={onCancelButtonClick}
              className='text-sm text-gray-400'
            >
              Cancelar
            </button>
          </div>
        )}

        {!isEditing && (
          <button
            type='button'
            onClick={onEditButtonClick}
            className='text-sm text-green-400'
          >
            Editar
          </button>
        )}
      </div>
    </div>
  )
}
