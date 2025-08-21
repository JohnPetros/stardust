type Props = {
  value: string
  errorMessage: string
  isEditing: boolean
  onChange: (value: string) => void
  onEditButtonClick: () => void
  onSaveButtonClick: () => void
  onCancelButtonClick: () => void
}

export const NameInputView = ({
  value,
  errorMessage,
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

      <div>
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

        {errorMessage && <p className='absolute text-sm text-red-400'>{errorMessage}</p>}
      </div>

      <div className='flex justify-end gap-2'>
        {isEditing && (
          <div className='flex flex-col items-center'>
            <button
              type='button'
              disabled={Boolean(errorMessage)}
              onClick={onSaveButtonClick}
              className='text-sm text-green-400 disabled:opacity-50 disabled:cursor-not-allowed'
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
