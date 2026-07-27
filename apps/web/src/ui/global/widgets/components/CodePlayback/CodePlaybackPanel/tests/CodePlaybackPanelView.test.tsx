import { render, screen, within } from '@testing-library/react'

import type { CodePlaybackPanelDto } from '@stardust/core/global/structures/dtos'

import { CodePlaybackPanelView } from '../CodePlaybackPanelView'

function View(panel: CodePlaybackPanelDto) {
  render(<CodePlaybackPanelView panel={panel} />)
}

describe('CodePlaybackPanelView', () => {
  it('renders every panel variant in the declared order without changing the DTO', () => {
    const panels: CodePlaybackPanelDto[] = [
      {
        type: 'sequence',
        title: 'NUMS',
        kind: 'array',
        items: [2, 7],
        showIndices: true,
      },
      { type: 'scalar', title: 'ALVO', value: 9, state: 'active' },
      {
        type: 'map',
        title: 'VISTOS',
        entries: [{ key: '2', value: 0, state: 'visited' }],
      },
      {
        type: 'set',
        title: 'VISITADOS',
        items: [{ value: 2, state: 'matched' }],
      },
      {
        type: 'grid',
        title: 'COMPARAÇÕES',
        rows: [[{ value: 2, state: 'active' }]],
        showIndices: true,
      },
      { type: 'result', title: 'RESULTADO', value: [0, 1], status: 'success' },
    ]
    const snapshot = JSON.parse(JSON.stringify(panels)) as CodePlaybackPanelDto[]

    const container = render(
      <div>
        {panels.map((panel) => (
          <CodePlaybackPanelView key={panel.title} panel={panel} />
        ))}
      </div>,
    ).container
    const renderedPanels = within(container).getAllByRole('region')

    expect(renderedPanels.map((panel) => panel.dataset.panelType)).toEqual([
      'sequence',
      'scalar',
      'map',
      'set',
      'grid',
      'result',
    ])
    expect(panels).toEqual(snapshot)
  })

  it('renders custom and fallback empty labels for collections', () => {
    const collections: CodePlaybackPanelDto[] = [
      {
        type: 'sequence',
        title: 'A',
        kind: 'list',
        items: [],
        showIndices: true,
        emptyLabel: 'Sem itens',
      },
      { type: 'map', title: 'B', entries: [] },
      { type: 'set', title: 'C', items: [], emptyLabel: 'Nenhum visitado' },
      { type: 'grid', title: 'D', rows: [], showIndices: true },
    ]

    const container = render(
      <div>
        {collections.map((panel) => (
          <CodePlaybackPanelView key={panel.title} panel={panel} />
        ))}
      </div>,
    ).container

    expect(within(container).getByText('Sem itens')).toBeInTheDocument()
    expect(within(container).getByText('Nenhum visitado')).toBeInTheDocument()
    expect(within(container).getAllByText('Vazio')).toHaveLength(2)
    expect(within(container).getByText('lista')).toBeInTheDocument()
    expect(within(container).queryByText('list')).not.toBeInTheDocument()
  })

  it('renders indices, multiple pointers, and simple, multiple, and range highlights', () => {
    View({
      type: 'sequence',
      title: 'NUMS',
      kind: 'array',
      items: [2, 7, 11, 15],
      showIndices: true,
      pointers: [
        { label: 'i', index: 1 },
        { label: 'j', index: 1 },
        { label: 'fim', index: 3 },
      ],
      highlights: [
        { startIndex: 0, endIndex: 0, state: 'visited' },
        { startIndex: 1, endIndex: 1, state: 'matched' },
        { startIndex: 2, endIndex: 3, state: 'active' },
      ],
    })

    expect(screen.getByText('i → índice 1')).toBeInTheDocument()
    expect(screen.getByText('j → índice 1')).toBeInTheDocument()
    expect(screen.getByText('fim → índice 3')).toBeInTheDocument()
    expect(screen.getByText('lista')).toBeInTheDocument()
    expect(screen.queryByText('array')).not.toBeInTheDocument()

    const items = screen.getByTestId('code-playback-sequence-items').children
    expect(items).toHaveLength(4)
    expect(items[0]).toHaveAttribute('data-highlight-start', '0')
    expect(items[0]).toHaveAttribute('data-highlight-end', '0')
    expect(items[1]).toHaveAttribute('data-pointer-labels', 'i,j')
    expect(items[2]).toHaveAttribute('data-highlight-start', '2')
    expect(items[3]).toHaveAttribute('data-highlight-end', '3')
    expect(screen.queryByText('matched')).not.toBeInTheDocument()
    expect(screen.queryByText('visited')).not.toBeInTheDocument()
  })

  it('preserves long values with the declared wrap and scroll overflow', () => {
    const longValue = 'linha 1\nlinha 2 com um valor muito extenso'

    View({
      type: 'scalar',
      title: 'WRAP',
      value: longValue,
      overflow: 'wrap',
    })
    expect(screen.getByTestId('code-playback-panel-scalar')).toHaveAttribute(
      'data-overflow',
      'wrap',
    )
    expect(screen.queryByTestId('code-playback-overflow')).not.toBeInTheDocument()
    expect(screen.getByTestId('code-playback-scalar-value')).toHaveAttribute(
      'data-overflow',
      'wrap',
    )
    expect(
      screen.getByTestId('code-playback-scalar-value').querySelector('[data-value]'),
    ).toHaveAttribute('data-value', longValue)

    render(
      <CodePlaybackPanelView
        panel={{
          type: 'result',
          title: 'SCROLL',
          value: longValue,
          status: 'neutral',
          overflow: 'scroll',
        }}
      />,
    )
    expect(screen.getByTestId('code-playback-result')).toHaveAttribute(
      'data-overflow',
      'scroll',
    )
    expect(screen.getByTestId('code-playback-result')).toHaveAttribute(
      'data-status',
      'neutral',
    )
  })

  it('formats booleans in Brazilian Portuguese, including nested values', () => {
    View({
      type: 'scalar',
      title: 'RESULTADO',
      value: {
        aprovado: true,
        detalhes: [false, { valido: true }],
      },
    })

    const value = screen
      .getByTestId('code-playback-scalar-value')
      .querySelector('[data-value]')

    expect(value).toHaveAttribute(
      'data-value',
      '{"aprovado": verdadeiro, "detalhes": [falso, {"valido": verdadeiro}]}',
    )
    expect(value).toHaveTextContent(
      '{"aprovado": verdadeiro, "detalhes": [falso, {"valido": verdadeiro}]}',
    )
    expect(value).not.toHaveTextContent(/\b(true|false)\b/)
  })

  it('exposes visual states through structure and color without status badges', () => {
    View({
      type: 'grid',
      title: 'ESTADOS',
      rows: [
        [
          { value: 'ok', state: 'success' },
          { value: 'falha', state: 'error' },
        ],
      ],
      showIndices: false,
    })

    const successCell = screen.getByText('ok').closest('td')
    const errorCell = screen.getByText('falha').closest('td')

    expect(successCell).toHaveAttribute('data-state', 'success')
    expect(successCell).toHaveClass('border-green-400')
    expect(errorCell).toHaveAttribute('data-state', 'error')
    expect(errorCell).toHaveClass('border-red-400')
    expect(screen.queryByText('success')).not.toBeInTheDocument()
    expect(screen.queryByText('error')).not.toBeInTheDocument()
  })
})
