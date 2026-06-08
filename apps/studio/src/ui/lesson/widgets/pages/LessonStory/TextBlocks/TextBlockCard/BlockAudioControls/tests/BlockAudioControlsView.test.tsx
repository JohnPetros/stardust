import { render, screen } from '@testing-library/react'

import { BlockAudioControlsView } from '../BlockAudioControlsView'

describe('BlockAudioControlsView', () => {
  const View = () =>
    render(
      <BlockAudioControlsView
        isGenerating={false}
        isRemoving={false}
        isGenerateDisabled={false}
        canCancel={false}
        canRemove={true}
        statusLabel={null}
        statusVariant='secondary'
        selector={<div>Seletor</div>}
        player={<div>Player</div>}
        onGenerate={jest.fn()}
        onCancel={jest.fn()}
        onRemove={jest.fn()}
      />,
    )

  it('should render remove audio button when removal is allowed', () => {
    View()

    expect(screen.getByRole('button', { name: 'Remover audio' })).toBeInTheDocument()
  })

  it('should render removing state while audio removal is in progress', () => {
    render(
      <BlockAudioControlsView
        isGenerating={false}
        isRemoving={true}
        isGenerateDisabled={false}
        canCancel={false}
        canRemove={true}
        statusLabel={null}
        statusVariant='secondary'
        selector={<div>Seletor</div>}
        player={<div>Player</div>}
        onGenerate={jest.fn()}
        onCancel={jest.fn()}
        onRemove={jest.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Removendo...' })).toBeDisabled()
  })
})
