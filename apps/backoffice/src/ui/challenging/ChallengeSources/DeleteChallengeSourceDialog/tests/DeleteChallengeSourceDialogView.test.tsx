import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

import { DeleteChallengeSourceDialogView } from '../DeleteChallengeSourceDialogView'

type Props = ComponentProps<typeof DeleteChallengeSourceDialogView>

describe('DeleteChallengeSourceDialogView', () => {
  const View = (props?: Partial<Props>) => {
    render(
      <DeleteChallengeSourceDialogView onConfirm={jest.fn()} {...props}>
        <button type='button'>Remover fonte</button>
      </DeleteChallengeSourceDialogView>,
    )
  }

  it('should render trigger button', () => {
    View()

    expect(screen.getByRole('button', { name: 'Remover fonte' })).toBeInTheDocument()
  })

  it('should open dialog and render expected texts', async () => {
    const user = userEvent.setup()

    View()

    expect(screen.queryByText('Deseja remover esta fonte?')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remover fonte' }))

    expect(screen.getByText('Deseja remover esta fonte?')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Esta ação não pode ser desfeita e removerá o vínculo da fonte com o desafio.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument()
  })

  it('should close dialog when cancel is clicked', async () => {
    const user = userEvent.setup()

    View()

    await user.click(screen.getByRole('button', { name: 'Remover fonte' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => {
      expect(screen.queryByText('Deseja remover esta fonte?')).not.toBeInTheDocument()
    })
  })

  it('should call onConfirm when confirm action is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()

    View({ onConfirm })

    await user.click(screen.getByRole('button', { name: 'Remover fonte' }))
    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
