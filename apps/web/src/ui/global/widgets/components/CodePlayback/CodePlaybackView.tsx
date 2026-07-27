import type {
  CodePlaybackDto,
  CodePlaybackInputDto,
  CodePlaybackStepDto,
} from '@stardust/core/global/structures/dtos'
import { twMerge } from 'tailwind-merge'

import { CodeEditor } from '@/ui/global/widgets/components/CodeEditor'
import { CodePlaybackControls } from './CodePlaybackControls'
import { CodePlaybackPanel } from './CodePlaybackPanel'
import type { CodePlaybackSpeed } from './types/CodePlaybackSpeed'

export type Props = {
  code: CodePlaybackDto['code']
  input: CodePlaybackInputDto
  currentStep: CodePlaybackStepDto
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

export function CodePlaybackView({
  code,
  input,
  currentStep,
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
  const inputUsesScroll = input.overflow === 'scroll'
  const containerClassName = twMerge(
    'min-w-0 overflow-hidden rounded-xl border border-gray-700 bg-gray-900 text-gray-100 shadow-lg',
    isExpanded
      ? 'fixed inset-0 z-[1000] flex h-dvh flex-col overflow-hidden rounded-none border-0'
      : 'flex flex-col',
  )

  const content = (
    <>
      <CodePlaybackControls
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        speed={speed}
        isExpanded={isExpanded}
        onPreviousStep={onPreviousStep}
        onPlay={onPlay}
        onPause={onPause}
        onNextStep={onNextStep}
        onSeek={onSeek}
        onChangeSpeed={onChangeSpeed}
        onToggleExpanded={onToggleExpanded}
      />

      <div
        data-layout-direction={isExpanded ? 'responsive-split' : 'stacked'}
        data-testid='code-playback-layout'
        className={twMerge(
          'min-h-0 min-w-0 gap-4',
          isExpanded
            ? 'grid flex-1 grid-cols-1 overflow-y-auto overscroll-contain lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.15fr)] lg:grid-rows-1 lg:overflow-hidden'
            : 'flex flex-col',
        )}
      >
        <div
          data-slot='state-column'
          className={twMerge(
            'flex min-w-0 flex-col gap-3 p-3 sm:p-4',
            isExpanded && 'lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-1',
          )}
        >
          <div data-slot='state' className='flex min-w-0 flex-col gap-3'>
            <section
              aria-label='Entrada da execução'
              data-overflow={input.overflow}
              data-testid='code-playback-input'
              className='min-w-0 rounded-lg border border-gray-700 bg-gray-950/40 p-3 sm:p-4'
            >
              <h2 className='mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300'>
                Entrada
              </h2>
              <pre
                data-testid='code-playback-input-content'
                className={twMerge(
                  'min-w-0 font-mono text-sm text-gray-100',
                  inputUsesScroll
                    ? 'max-w-full overflow-x-auto whitespace-pre pb-2'
                    : 'whitespace-pre-wrap break-words',
                )}
              >
                {input.content}
              </pre>
            </section>

            <ul
              aria-label='Estado da etapa'
              className='m-0 flex min-w-0 list-none flex-col gap-3 p-0'
              data-testid='code-playback-panels'
            >
              {currentStep.panels.map((panel, panelIndex) => (
                <li
                  key={`${panel.type}-${panel.title}-${panelIndex}`}
                  className='min-w-0'
                >
                  <CodePlaybackPanel panel={panel} />
                </li>
              ))}
            </ul>
          </div>

          <section
            aria-atomic='true'
            aria-live='polite'
            aria-label={`Explicação da etapa ${currentStepIndex + 1} de ${totalSteps}`}
            data-slot='explanation'
            data-testid='code-playback-explanation'
            className='rounded-lg border border-cyan-800 bg-cyan-950/40 p-3 sm:p-4'
          >
            <h2 className='mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-200'>
              Explicação
            </h2>
            <p className='whitespace-pre-wrap text-sm leading-relaxed text-gray-100'>
              {currentStep.explanation}
            </p>
          </section>
        </div>

        <section
          aria-label='Código da solução'
          data-slot='code'
          data-testid='code-playback-editor'
          className={twMerge(
            'min-h-[24rem] min-w-0 overflow-hidden border-t border-gray-700 bg-gray-950',
            isExpanded && 'lg:min-h-0 lg:border-l lg:border-t-0',
          )}
        >
          <CodeEditor
            value={code}
            width='100%'
            height={isExpanded ? '100%' : '32rem'}
            isReadOnly
            isCodeCheckerDisabled
            highlightedLineRanges={currentStep.activeLineRanges}
          />
        </section>
      </div>
    </>
  )

  if (isExpanded) {
    return (
      <div
        aria-label='Code Playback'
        aria-modal='true'
        className={containerClassName}
        data-layout='expanded'
        data-testid='code-playback'
        role='dialog'
      >
        {content}
      </div>
    )
  }

  return (
    <section
      aria-label='Code Playback'
      className={containerClassName}
      data-layout='default'
      data-testid='code-playback'
    >
      {content}
    </section>
  )
}
