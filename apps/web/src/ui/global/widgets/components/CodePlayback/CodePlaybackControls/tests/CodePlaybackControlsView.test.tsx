import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CodePlaybackControlsView, type Props } from '../CodePlaybackControlsView'

function View(props?: Partial<Props>) {
  const defaultProps: Props = {
    currentStepIndex: 1,
    totalSteps: 3,
    isPlaying: false,
    speed: '1x',
    isExpanded: false,
    onPreviousStep: jest.fn(),
    onPlay: jest.fn(),
    onPause: jest.fn(),
    onNextStep: jest.fn(),
    onSeek: jest.fn(),
    onChangeSpeed: jest.fn(),
    onToggleExpanded: jest.fn(),
  }

  render(<CodePlaybackControlsView {...defaultProps} {...props} />)
}

describe('CodePlaybackControlsView', () => {
  it('exposes accessible names and a visible keyboard focus target for every control', async () => {
    const user = userEvent.setup()
    const onPreviousStep = jest.fn()
    View({ onPreviousStep })

    expect(screen.getByRole('button', { name: 'Etapa anterior' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reproduzir reprodução' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Próxima etapa' })).toBeInTheDocument()
    expect(
      screen.getByRole('slider', { name: 'Posição na linha do tempo' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', { name: 'Velocidade da reprodução' }),
    ).toHaveClass('appearance-none', '[color-scheme:dark]')
    expect(
      screen
        .getByRole('combobox', { name: 'Velocidade da reprodução' })
        .parentElement?.querySelector('span[aria-hidden="true"]'),
    ).toHaveClass('text-green-300')
    expect(
      screen.getByRole('button', { name: 'Expandir Code Playback' }),
    ).toBeInTheDocument()

    await user.tab()
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Etapa anterior' }),
    )
    expect(screen.getByRole('button', { name: 'Etapa anterior' })).toHaveClass(
      'custom-outline',
    )

    await user.keyboard('{Enter}')
    expect(onPreviousStep).toHaveBeenCalledTimes(1)
  })

  it('keeps playback navigation available while autoplay is active and toggles play state', async () => {
    const user = userEvent.setup()
    const onPlay = jest.fn()
    const onPreviousStep = jest.fn()
    const onNextStep = jest.fn()
    const onSeek = jest.fn()

    View({ isPlaying: true, onPlay, onPreviousStep, onNextStep, onSeek })

    const pauseButton = screen.getByRole('button', { name: 'Pausar reprodução' })
    expect(pauseButton).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Etapa anterior' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Próxima etapa' })).not.toBeDisabled()
    expect(
      screen.getByRole('slider', { name: 'Posição na linha do tempo' }),
    ).not.toBeDisabled()

    await user.click(pauseButton)
    expect(onPlay).not.toHaveBeenCalled()
  })

  it('disables navigation at sequence limits and announces timeline values', () => {
    View({ currentStepIndex: 0, totalSteps: 3 })

    expect(screen.getByRole('button', { name: 'Etapa anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Próxima etapa' })).not.toBeDisabled()
    expect(
      screen.getByRole('slider', { name: 'Posição na linha do tempo' }),
    ).toHaveAttribute('aria-valuetext', 'Etapa 1 de 3')

    cleanup()
    View({ currentStepIndex: 2, totalSteps: 3 })
    expect(screen.getByRole('button', { name: 'Etapa anterior' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Próxima etapa' })).toBeDisabled()
  })

  it('calls every control callback and supports all playback speeds', async () => {
    const user = userEvent.setup()
    const onPreviousStep = jest.fn()
    const onPlay = jest.fn()
    const onPause = jest.fn()
    const onNextStep = jest.fn()
    const onSeek = jest.fn()
    const onChangeSpeed = jest.fn()
    const onToggleExpanded = jest.fn()

    View({
      onPreviousStep,
      onPlay,
      onPause,
      onNextStep,
      onSeek,
      onChangeSpeed,
      onToggleExpanded,
    })

    await user.click(screen.getByRole('button', { name: 'Etapa anterior' }))
    await user.click(screen.getByRole('button', { name: 'Reproduzir reprodução' }))
    await user.click(screen.getByRole('button', { name: 'Próxima etapa' }))
    const timeline = screen.getByRole('slider', { name: 'Posição na linha do tempo' })
    fireEvent.change(timeline, { target: { value: '2' } })
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Velocidade da reprodução' }),
      '0.5x',
    )
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Velocidade da reprodução' }),
      '1x',
    )
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Velocidade da reprodução' }),
      '2x',
    )
    await user.click(screen.getByRole('button', { name: 'Expandir Code Playback' }))

    expect(onPreviousStep).toHaveBeenCalledTimes(1)
    expect(onPlay).toHaveBeenCalledTimes(1)
    expect(onNextStep).toHaveBeenCalledTimes(1)
    expect(onSeek).toHaveBeenCalledWith(2)
    expect(onChangeSpeed).toHaveBeenNthCalledWith(1, '0.5x')
    expect(onChangeSpeed).toHaveBeenNthCalledWith(2, '1x')
    expect(onChangeSpeed).toHaveBeenNthCalledWith(3, '2x')
    expect(onToggleExpanded).toHaveBeenCalledTimes(1)

    cleanup()
    View({ isPlaying: true, onPause })
    await user.click(screen.getByRole('button', { name: 'Pausar reprodução' }))
    expect(onPause).toHaveBeenCalledTimes(1)
  })

  it('uses text and structure to expose playing, selected and expanded states', () => {
    View({ isPlaying: true, isExpanded: true, speed: '2x' })

    expect(screen.getByText('Pausar')).toBeVisible()
    expect(screen.getByTestId('code-playback-controls')).toHaveAttribute(
      'data-state',
      'playing',
    )
    expect(screen.getByRole('button', { name: 'Pausar reprodução' })).toHaveAttribute(
      'data-state',
      'playing',
    )
    expect(
      screen.getByRole('button', { name: 'Recolher Code Playback' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('combobox', { name: 'Velocidade da reprodução' }),
    ).toHaveValue('2x')
    expect(
      screen
        .getByRole('combobox', { name: 'Velocidade da reprodução' })
        .parentElement?.querySelector('span[aria-hidden="true"]'),
    ).toBeInTheDocument()
  })
})
