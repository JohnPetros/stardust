import { render, screen, within } from '@testing-library/react'

import type {
  CodePlaybackDto,
  CodePlaybackLineRangeDto,
  CodePlaybackPanelDto,
} from '@stardust/core/global/structures/dtos'

import { CodePlaybackView, type Props } from '../CodePlaybackView'

jest.mock('@/ui/global/widgets/components/CodeEditor', () => ({
  CodeEditor: ({
    value,
    width,
    height,
    isReadOnly,
    isCodeCheckerDisabled,
    highlightedLineRanges,
  }: {
    value: string
    width: number | string
    height: number | string
    isReadOnly?: boolean
    isCodeCheckerDisabled?: boolean
    highlightedLineRanges?: CodePlaybackLineRangeDto[]
  }) => (
    <div
      data-height={height}
      data-highlighted-line-ranges={JSON.stringify(highlightedLineRanges)}
      data-is-code-checker-disabled={String(isCodeCheckerDisabled)}
      data-is-read-only={String(isReadOnly)}
      data-testid='mock-code-editor'
      data-width={width}
    >
      {value}
    </div>
  ),
}))

jest.mock('../CodePlaybackControls', () => ({
  CodePlaybackControls: ({
    currentStepIndex,
    totalSteps,
    isPlaying,
    speed,
    isExpanded,
  }: {
    currentStepIndex: number
    totalSteps: number
    isPlaying: boolean
    speed: string
    isExpanded: boolean
  }) => (
    <div
      data-current-step-index={currentStepIndex}
      data-is-expanded={String(isExpanded)}
      data-is-playing={String(isPlaying)}
      data-speed={speed}
      data-testid='mock-code-playback-controls'
    >
      <output aria-live='polite'>
        Etapa {currentStepIndex + 1} de {totalSteps}
      </output>
    </div>
  ),
}))

jest.mock('../CodePlaybackPanel', () => ({
  CodePlaybackPanel: ({ panel }: { panel: CodePlaybackPanelDto }) => (
    <article
      data-panel={JSON.stringify(panel)}
      data-panel-title={panel.title}
      data-panel-type={panel.type}
      data-testid='mock-code-playback-panel'
    >
      {panel.title}
    </article>
  ),
}))

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value
  }

  Object.freeze(value)
  Object.values(value as Record<string, unknown>).forEach(deepFreeze)

  return value
}

const PLAYBACK = deepFreeze<CodePlaybackDto>({
  code: [
    'funcao doisSoma(nums, alvo) {',
    '  var vistos = {}',
    '  para (var i = 0; i < nums.tamanho(); i++) {',
    '    var complemento = alvo - nums[i]',
    '    se (vistos[complemento] != nulo) retorna [vistos[complemento], i]',
    '    vistos[nums[i]] = i',
    '  }',
    '}',
  ].join('\n'),
  input: {
    content: 'nums = [2, 7, 11, 15]\nalvo = 9',
    overflow: 'scroll',
  },
  steps: [
    {
      activeLineRanges: [
        { startLine: 2, endLine: 2 },
        { startLine: 3, endLine: 4 },
      ],
      explanation: 'Inicia o mapa e calcula o complemento do primeiro item.',
      panels: [
        {
          type: 'sequence',
          title: 'NUMS',
          kind: 'array',
          items: [2, 7, 11, 15],
          showIndices: true,
          pointers: [
            { label: 'i', index: 0 },
            { label: 'j', index: 1 },
          ],
          highlights: [{ startIndex: 0, endIndex: 1, state: 'active' }],
          overflow: 'wrap',
        },
        {
          type: 'scalar',
          title: 'ALVO',
          value: 9,
          state: 'active',
        },
        {
          type: 'map',
          title: 'VISTOS',
          entries: [],
          emptyLabel: 'Vazio',
        },
        {
          type: 'set',
          title: 'VISITADOS',
          items: [],
          emptyLabel: 'Vazio',
        },
        {
          type: 'grid',
          title: 'COMPARAÇÕES',
          rows: [
            [
              { value: 2, state: 'active' },
              { value: 7, state: 'matched' },
            ],
            [{ value: 11 }, { value: 15 }],
          ],
          showIndices: true,
        },
        {
          type: 'result',
          title: 'RESULTADO',
          value: null,
          status: 'neutral',
        },
      ],
    },
    {
      activeLineRanges: [{ startLine: 5, endLine: 6 }],
      explanation: 'Registra o primeiro índice e encontra o complemento.',
      panels: [
        {
          type: 'sequence',
          title: 'NUMS',
          kind: 'array',
          items: [2, 7, 11, 15],
          showIndices: true,
          pointers: [{ label: 'i', index: 1 }],
          highlights: [
            { startIndex: 0, endIndex: 0, state: 'visited' },
            { startIndex: 1, endIndex: 1, state: 'matched' },
          ],
        },
        {
          type: 'map',
          title: 'VISTOS',
          entries: [{ key: '2', value: 0, state: 'visited' }],
        },
      ],
    },
    {
      activeLineRanges: [{ startLine: 5, endLine: 5 }],
      explanation: 'Retorna os índices que formam o alvo.',
      panels: [
        {
          type: 'result',
          title: 'RESULTADO',
          value: [0, 1],
          status: 'success',
          overflow: 'scroll',
        },
      ],
    },
  ],
})

function getProps(props?: Partial<Props>): Props {
  return {
    code: PLAYBACK.code,
    input: PLAYBACK.input,
    currentStep: PLAYBACK.steps[0],
    currentStepIndex: 0,
    totalSteps: PLAYBACK.steps.length,
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
    ...props,
  }
}

function View(props?: Partial<Props>) {
  return render(<CodePlaybackView {...getProps(props)} />)
}

function getRenderedPanelTitles() {
  return screen
    .getAllByTestId('mock-code-playback-panel')
    .map((panel) => panel.dataset.panelTitle)
}

describe('CodePlaybackView', () => {
  it('composes the immutable normative fixture in its declared order', () => {
    View()

    expect(screen.getByRole('region', { name: 'Code Playback' })).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Entrada da execução' }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('code-playback-input')).toHaveAttribute(
      'data-overflow',
      'scroll',
    )
    expect(screen.getByTestId('code-playback-input-content').textContent).toBe(
      PLAYBACK.input.content,
    )
    expect(screen.getByTestId('code-playback-input-content')).toHaveClass(
      'whitespace-pre',
      'overflow-x-auto',
    )
    expect(getRenderedPanelTitles()).toEqual([
      'NUMS',
      'ALVO',
      'VISTOS',
      'VISITADOS',
      'COMPARAÇÕES',
      'RESULTADO',
    ])
    expect(
      screen
        .getAllByTestId('mock-code-playback-panel')
        .map((panel) => panel.dataset.panelType),
    ).toEqual(['sequence', 'scalar', 'map', 'set', 'grid', 'result'])

    const editor = screen.getByTestId('mock-code-editor')
    expect(editor.textContent).toBe(PLAYBACK.code)
    expect(editor).toHaveAttribute('data-width', '100%')
    expect(editor).toHaveAttribute('data-height', '32rem')
    expect(editor).toHaveAttribute('data-is-read-only', 'true')
    expect(editor).toHaveAttribute('data-is-code-checker-disabled', 'true')
    expect(editor).toHaveAttribute(
      'data-highlighted-line-ranges',
      JSON.stringify(PLAYBACK.steps[0].activeLineRanges),
    )
    expect(Object.isFrozen(PLAYBACK)).toBe(true)
    expect(Object.isFrozen(PLAYBACK.steps[0].panels)).toBe(true)
  })

  it('synchronizes and restores the complete rendered snapshot while preserving input', () => {
    const { rerender } = View()
    const initialPanels = screen
      .getAllByTestId('mock-code-playback-panel')
      .map((panel) => panel.dataset.panel)
    const initialInput = screen.getByTestId('code-playback-input-content').textContent
    const initialExplanation = screen.getByTestId('code-playback-explanation').textContent
    const initialRanges = screen
      .getByTestId('mock-code-editor')
      .getAttribute('data-highlighted-line-ranges')

    rerender(
      <CodePlaybackView
        {...getProps({
          currentStep: PLAYBACK.steps[1],
          currentStepIndex: 1,
        })}
      />,
    )

    expect(getRenderedPanelTitles()).toEqual(['NUMS', 'VISTOS'])
    expect(screen.getByTestId('code-playback-explanation')).toHaveTextContent(
      PLAYBACK.steps[1].explanation,
    )
    expect(screen.getByTestId('mock-code-editor')).toHaveAttribute(
      'data-highlighted-line-ranges',
      JSON.stringify(PLAYBACK.steps[1].activeLineRanges),
    )
    expect(screen.getByTestId('code-playback-input-content').textContent).toBe(
      PLAYBACK.input.content,
    )

    rerender(<CodePlaybackView {...getProps()} />)

    expect(
      screen
        .getAllByTestId('mock-code-playback-panel')
        .map((panel) => panel.dataset.panel),
    ).toEqual(initialPanels)
    expect(screen.getByTestId('code-playback-input-content').textContent).toBe(
      initialInput,
    )
    expect(screen.getByTestId('code-playback-explanation').textContent).toBe(
      initialExplanation,
    )
    expect(
      screen.getByTestId('mock-code-editor').getAttribute('data-highlighted-line-ranges'),
    ).toBe(initialRanges)
  })

  it('announces playback position and each complete explanation politely', () => {
    View({
      currentStep: PLAYBACK.steps[2],
      currentStepIndex: 2,
    })

    expect(screen.getByText('Etapa 3 de 3')).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByTestId('code-playback-explanation')).toHaveAttribute(
      'aria-live',
      'polite',
    )
    expect(screen.getByTestId('code-playback-explanation')).toHaveAttribute(
      'aria-atomic',
      'true',
    )
    expect(screen.getByLabelText('Explicação da etapa 3 de 3')).toHaveTextContent(
      PLAYBACK.steps[2].explanation,
    )
  })

  it('uses a stacked default layout', () => {
    View()

    expect(screen.getByTestId('code-playback')).toHaveAttribute('data-layout', 'default')
    expect(screen.getByTestId('code-playback-layout')).toHaveAttribute(
      'data-layout-direction',
      'stacked',
    )
    expect(screen.getByTestId('code-playback-layout')).toHaveClass('flex', 'flex-col')

    const slots = within(screen.getByTestId('code-playback-layout')).getAllByRole(
      'region',
    )
    expect(slots.at(-1)).toHaveAccessibleName('Código da solução')
  })

  it('uses a desktop split and a narrow vertical fallback in expanded layout', () => {
    View({ isExpanded: true })

    expect(screen.getByRole('dialog', { name: 'Code Playback' })).toBeInTheDocument()
    expect(screen.getByTestId('code-playback')).toHaveClass(
      'fixed',
      'inset-0',
      'h-dvh',
      'overflow-hidden',
    )
    expect(screen.getByTestId('code-playback-layout')).toHaveAttribute(
      'data-layout-direction',
      'responsive-split',
    )
    expect(screen.getByTestId('code-playback-layout')).toHaveClass(
      'grid',
      'grid-cols-1',
      'overflow-y-auto',
      'lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.15fr)]',
      'lg:overflow-hidden',
    )
    expect(screen.getByTestId('code-playback-editor')).toHaveClass(
      'min-h-[24rem]',
      'lg:min-h-0',
    )
  })

  it('preserves step, speed, and play state when only the layout changes', () => {
    const stableProps = getProps({
      currentStep: PLAYBACK.steps[1],
      currentStepIndex: 1,
      isPlaying: true,
      speed: '2x',
    })
    const { rerender } = render(<CodePlaybackView {...stableProps} />)

    rerender(<CodePlaybackView {...stableProps} isExpanded />)

    const controls = screen.getByTestId('mock-code-playback-controls')
    expect(controls).toHaveAttribute('data-current-step-index', '1')
    expect(controls).toHaveAttribute('data-is-playing', 'true')
    expect(controls).toHaveAttribute('data-speed', '2x')
    expect(controls).toHaveAttribute('data-is-expanded', 'true')
    expect(getRenderedPanelTitles()).toEqual(['NUMS', 'VISTOS'])
    expect(screen.getByTestId('code-playback-explanation')).toHaveTextContent(
      PLAYBACK.steps[1].explanation,
    )

    rerender(<CodePlaybackView {...stableProps} isExpanded={false} />)

    expect(controls).toHaveAttribute('data-current-step-index', '1')
    expect(controls).toHaveAttribute('data-is-playing', 'true')
    expect(controls).toHaveAttribute('data-speed', '2x')
    expect(getRenderedPanelTitles()).toEqual(['NUMS', 'VISTOS'])
  })
})
