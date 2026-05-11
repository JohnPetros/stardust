import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('@/ui/global/widgets/components/WYSIWYGEditor', () => ({
  WYSIWYGEditor: ({
    value,
    onChange,
  }: {
    value: string
    onChange: (value: string) => void
  }) => (
    <textarea
      aria-label='Conteudo'
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}))

import { NoteEditorForm } from '..'

const INVALID_TITLE_MESSAGE = 'Titulo deve conter pelo menos 1 caractere'

describe('NoteEditorForm', () => {
  let onSubmit: jest.Mock<Promise<boolean>, [{ title: string; content: string }]>
  let onDirtyChange: jest.Mock

  const Widget = () => (
    <NoteEditorForm
      formId='note-editor-form'
      note={null}
      onSubmit={onSubmit}
      onDirtyChange={onDirtyChange}
    />
  )

  const FormFields = () => {
    const titleInput = screen.getByLabelText('Titulo')
    const contentInput = screen.getByLabelText('Conteudo')
    const form = titleInput.closest('form')

    if (!form) {
      throw new Error('Note editor form not found')
    }

    return { titleInput, contentInput, form }
  }

  beforeEach(() => {
    onSubmit = jest.fn().mockResolvedValue(true)
    onDirtyChange = jest.fn()
  })

  it('should submit successfully with empty content', async () => {
    const user = userEvent.setup()

    render(<Widget />)

    const { titleInput, form } = FormFields()

    await user.type(titleInput, 'Nota sem corpo')

    await act(async () => {
      form.requestSubmit()
    })

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Nota sem corpo',
        content: '',
      })
    })
  })

  it('should submit successfully with short non-empty content', async () => {
    const user = userEvent.setup()

    render(<Widget />)

    const { titleInput, contentInput, form } = FormFields()

    await user.type(titleInput, 'Nota curta')
    await user.type(contentInput, 'oi')

    await act(async () => {
      form.requestSubmit()
    })

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Nota curta',
        content: 'oi',
      })
    })
  })

  it('should render validation error when title is empty', async () => {
    render(<Widget />)

    const { form } = FormFields()

    expect(screen.queryByText(INVALID_TITLE_MESSAGE)).toBeNull()

    await act(async () => {
      form.requestSubmit()
    })

    expect(await screen.findByText(INVALID_TITLE_MESSAGE)).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
