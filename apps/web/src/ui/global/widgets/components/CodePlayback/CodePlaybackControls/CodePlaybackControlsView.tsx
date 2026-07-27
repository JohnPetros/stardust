import { twMerge } from 'tailwind-merge'

import { Icon } from '@/ui/global/widgets/components/Icon'
import type { CodePlaybackSpeed } from '../types/CodePlaybackSpeed'

export type Props = {
  currentStepIndex: number
  totalSteps: number
  isPlaying: boolean
  speed: CodePlaybackSpeed
  isExpanded: boolean
  onPreviousStep: () => void
  onPlay: () => void
  onPause: () => void
  onNextStep: () => void
  onSeek: (stepIndex: number) => void
  onChangeSpeed: (speed: CodePlaybackSpeed) => void
  onToggleExpanded: () => void
}

const controlButtonClassName =
  'custom-outline inline-flex min-h-10 items-center justify-center gap-2 rounded border border-gray-600 bg-gray-800 px-3 text-sm font-semibold text-gray-100 transition-colors hover:border-green-400 hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-600 disabled:hover:bg-gray-800'

const speedOptions: CodePlaybackSpeed[] = ['0.5x', '1x', '2x']

function getStepPosition(currentStepIndex: number, totalSteps: number) {
  return `Etapa ${currentStepIndex + 1} de ${totalSteps}`
}

export function CodePlaybackControlsView({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  isExpanded,
  onPreviousStep,
  onPlay,
  onPause,
  onNextStep,
  onSeek,
  onChangeSpeed,
  onToggleExpanded,
}: Props) {
  const isAtFirstStep = currentStepIndex <= 0
  const isAtLastStep = currentStepIndex >= totalSteps - 1
  const stepPosition = getStepPosition(currentStepIndex, totalSteps)

  return (
    <div
      data-testid='code-playback-controls'
      data-state={isPlaying ? 'playing' : 'paused'}
      className='flex flex-col gap-3 border-b border-gray-700 bg-gray-900 p-3 text-gray-100 sm:gap-4 sm:px-4 sm:py-3'
    >
      <div
        role='group'
        aria-label='Navegação da reprodução'
        className='flex flex-wrap items-center justify-center gap-2'
      >
        <button
          type='button'
          aria-label='Etapa anterior'
          data-testid='previous-step'
          className={controlButtonClassName}
          disabled={isAtFirstStep}
          onClick={onPreviousStep}
        >
          <span aria-hidden='true'>
            <Icon name='simple-arrow-left' size={18} />
          </span>
          <span>Anterior</span>
        </button>

        <button
          type='button'
          aria-label={isPlaying ? 'Pausar reprodução' : 'Reproduzir reprodução'}
          aria-pressed={isPlaying}
          data-testid='play-pause'
          data-state={isPlaying ? 'playing' : 'paused'}
          className={twMerge(
            controlButtonClassName,
            isPlaying && 'border-green-400 bg-gray-700',
          )}
          onClick={isPlaying ? onPause : onPlay}
        >
          <span aria-hidden='true'>
            <Icon name={isPlaying ? 'pause' : 'start'} size={18} />
          </span>
          <span>{isPlaying ? 'Pausar' : 'Reproduzir'}</span>
        </button>

        <button
          type='button'
          aria-label='Próxima etapa'
          data-testid='next-step'
          className={controlButtonClassName}
          disabled={isAtLastStep}
          onClick={onNextStep}
        >
          <span>Próxima</span>
          <span aria-hidden='true'>
            <Icon name='simple-arrow-right' size={18} />
          </span>
        </button>
      </div>

      <div className='order-first flex min-w-0 items-center justify-between gap-3 border-b border-gray-800 pb-3'>
        <div className='flex min-w-0 items-center gap-3'>
          <span className='truncate text-xs font-bold uppercase tracking-[0.18em] text-gray-400'>
            Reprodução da solução
          </span>
          <output
            aria-label='Posição da reprodução'
            aria-live='polite'
            data-testid='step-position'
            className='shrink-0 text-sm font-semibold tabular-nums text-gray-100'
          >
            {stepPosition}
          </output>
        </div>

        <button
          type='button'
          aria-label={isExpanded ? 'Recolher Code Playback' : 'Expandir Code Playback'}
          aria-pressed={isExpanded}
          aria-expanded={isExpanded}
          data-testid='toggle-expanded'
          data-state={isExpanded ? 'expanded' : 'collapsed'}
          className={twMerge(
            controlButtonClassName,
            'min-h-8 px-2 sm:px-3',
            isExpanded && 'border-green-400 bg-gray-700',
          )}
          onClick={onToggleExpanded}
        >
          <span aria-hidden='true'>
            <Icon name='layout' size={16} />
          </span>
          <span className='hidden sm:inline'>{isExpanded ? 'Recolher' : 'Expandir'}</span>
        </button>
      </div>

      <div className='grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto]'>
        <label
          className='flex min-w-0 items-center gap-3'
          htmlFor='code-playback-timeline'
        >
          <span className='shrink-0 text-sm font-semibold'>Linha do tempo</span>
          <input
            id='code-playback-timeline'
            type='range'
            min={0}
            max={Math.max(0, totalSteps - 1)}
            step={1}
            value={currentStepIndex}
            aria-label='Posição na linha do tempo'
            aria-valuetext={stepPosition}
            data-testid='timeline'
            disabled={totalSteps <= 1}
            onChange={(event) => onSeek(Number(event.currentTarget.value))}
            className='h-2 min-w-0 flex-1 cursor-pointer accent-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 disabled:cursor-not-allowed disabled:opacity-50'
          />
        </label>

        <label
          className='flex min-h-10 items-center gap-2 rounded border border-gray-700 px-3 text-sm font-semibold'
          htmlFor='code-playback-speed'
        >
          <span>Velocidade</span>
          <span className='relative inline-flex items-center'>
            <select
              id='code-playback-speed'
              aria-label='Velocidade da reprodução'
              value={speed}
              data-testid='speed'
              onChange={(event) =>
                onChangeSpeed(event.currentTarget.value as CodePlaybackSpeed)
              }
              className='cursor-pointer appearance-none bg-transparent pr-5 font-bold text-green-300 [color-scheme:dark] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400'
            >
              {speedOptions.map((speedOption) => (
                <option
                  key={speedOption}
                  value={speedOption}
                  className='bg-gray-800 text-green-300'
                >
                  {speedOption}
                </option>
              ))}
            </select>
            <span
              aria-hidden='true'
              className='pointer-events-none absolute right-0 text-green-300'
            >
              <Icon name='simple-arrow-down' size={16} />
            </span>
          </span>
        </label>
      </div>

      <p aria-live='polite' data-testid='playback-status' className='sr-only'>
        {isPlaying ? 'Reprodução automática ativa' : 'Reprodução pausada'}
      </p>
    </div>
  )
}
