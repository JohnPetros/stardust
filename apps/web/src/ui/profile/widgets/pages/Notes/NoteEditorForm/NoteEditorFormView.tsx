import { WYSIWYGEditor } from '@/ui/global/widgets/components/WYSIWYGEditor'

type Props = {
  formId: string
  title: string
  content: string
  errors: {
    title?: { message?: string }
    content?: { message?: string }
  }
  handleFormSubmit: () => void
  handleTitleChange: (value: string) => void
  handleContentChange: (value: string) => void
}

export const NoteEditorFormView = ({
  formId,
  title,
  content,
  errors,
  handleFormSubmit,
  handleTitleChange,
  handleContentChange,
}: Props) => {
  return (
    <form
      id={formId}
      className='space-y-4'
      onSubmit={(event) => {
        event.preventDefault()
        handleFormSubmit()
      }}
    >
      <div className='space-y-2'>
        <label htmlFor='note-title' className='text-sm font-semibold text-gray-200'>
          Titulo
        </label>
        <input
          id='note-title'
          type='text'
          value={title}
          onChange={({ target }) => handleTitleChange(target.value)}
          className='h-12 w-full rounded-2xl border border-[#303030] bg-[#1e2626] px-4 text-sm font-semibold text-gray-100 outline-none focus:border-green-400'
        />
        {errors.title?.message && (
          <p className='text-xs text-red-400'>{errors.title.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <label htmlFor='note-content' className='text-sm font-semibold text-gray-200'>
          Conteudo
        </label>
        <WYSIWYGEditor value={content} onChange={handleContentChange} />
        {errors.content?.message && (
          <p className='text-xs text-red-400'>{errors.content.message}</p>
        )}
      </div>
    </form>
  )
}
