import type { ReactNode } from 'react'

import type {
  CodePlaybackHighlightRangeDto,
  CodePlaybackMapPanelDto,
  CodePlaybackOverflow,
  CodePlaybackPanelDto,
  CodePlaybackSequencePanelDto,
  CodePlaybackValue,
  CodePlaybackVisualState,
} from '@stardust/core/global/structures/dtos'

export type Props = {
  panel: CodePlaybackPanelDto
}

type VisualState = CodePlaybackVisualState | 'neutral'

const stateClassNames: Record<VisualState, string> = {
  active: 'border-cyan-400 bg-cyan-950/50 text-cyan-100',
  visited: 'border-gray-500 bg-gray-800 text-gray-200',
  matched: 'border-green-400 bg-green-950/40 text-green-100',
  success: 'border-green-400 bg-green-950/40 text-green-100',
  error: 'border-red-400 bg-red-950/40 text-red-100',
  muted: 'border-gray-700 bg-gray-900 text-gray-500',
  neutral: 'border-gray-600 bg-gray-800 text-gray-300',
}

function formatValue(value: CodePlaybackValue, isNested = false): string {
  if (value === null) return 'nulo'
  if (typeof value === 'string') return isNested ? JSON.stringify(value) : value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'verdadeiro' : 'falso'

  if (Array.isArray(value)) {
    return `[${value.map((item) => formatValue(item, true)).join(', ')}]`
  }

  return `{${Object.entries(value)
    .map(([key, item]) => `${JSON.stringify(key)}: ${formatValue(item, true)}`)
    .join(', ')}}`
}

function getOverflow(panel: CodePlaybackPanelDto) {
  return panel.overflow ?? 'wrap'
}

function getEmptyLabel(panel: CodePlaybackPanelDto) {
  return panel.emptyLabel ?? 'Vazio'
}

function getSequenceKindLabel(kind: CodePlaybackSequencePanelDto['kind']) {
  return kind === 'array' || kind === 'list' ? 'lista' : kind
}

function ValueView({
  value,
  state,
  overflow = 'wrap',
  className = '',
}: {
  value: CodePlaybackValue
  state?: CodePlaybackVisualState
  overflow?: CodePlaybackOverflow
  className?: string
}) {
  return (
    <span
      className={`min-w-0 font-mono ${overflow === 'scroll' ? 'whitespace-pre' : 'whitespace-pre-wrap break-words'} ${className}`}
      data-state={state}
      data-value={formatValue(value)}
    >
      {formatValue(value)}
    </span>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <p
      aria-label={`Estado vazio: ${label}`}
      className='rounded border border-dashed border-gray-600 px-3 py-4 text-sm italic text-gray-300'
      data-testid='code-playback-empty'
      role='status'
    >
      {label}
    </p>
  )
}

function PanelFrame({
  panel,
  children,
}: {
  panel: CodePlaybackPanelDto
  children: ReactNode
}) {
  const headingId = `code-playback-panel-heading-${panel.type}-${panel.title}`
  const overflow = getOverflow(panel)

  return (
    <section
      aria-labelledby={headingId}
      className='min-w-0 rounded-lg border border-gray-700 bg-gray-950/40 p-3 text-gray-100 sm:p-4'
      data-overflow={overflow}
      data-panel-type={panel.type}
      data-testid={`code-playback-panel-${panel.type}`}
    >
      <div className='mb-2 flex min-w-0 flex-wrap items-center justify-between gap-2'>
        <h3
          id={headingId}
          className='min-w-0 text-xs font-bold uppercase tracking-[0.14em] text-gray-300'
        >
          {panel.title}
        </h3>
      </div>
      {children}
    </section>
  )
}

function getHighlight(
  panel: CodePlaybackSequencePanelDto,
  index: number,
): CodePlaybackHighlightRangeDto | undefined {
  return panel.highlights?.find(
    (highlight) => index >= highlight.startIndex && index <= highlight.endIndex,
  )
}

function getPointersAtIndex(panel: CodePlaybackSequencePanelDto, index: number) {
  return panel.pointers?.filter((pointer) => pointer.index === index) ?? []
}

function SequencePanel({ panel }: { panel: CodePlaybackSequencePanelDto }) {
  const overflow = getOverflow(panel)

  return (
    <PanelFrame panel={panel}>
      <div className='mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-300'>
        <span className='rounded border border-gray-700 px-2 py-1 uppercase tracking-wide'>
          {getSequenceKindLabel(panel.kind)}
        </span>
        {panel.pointers && panel.pointers.length > 0 && (
          <div
            aria-label='Ponteiros da sequência'
            className='flex flex-wrap gap-2'
            data-testid='code-playback-pointers'
            role='group'
          >
            {panel.pointers.map((pointer) => (
              <span
                key={`${pointer.label}-${pointer.index}`}
                className='rounded border border-cyan-700 px-2 py-1 font-mono'
                data-pointer-index={pointer.index}
                data-pointer-label={pointer.label}
              >
                {pointer.label} → índice {pointer.index}
              </span>
            ))}
          </div>
        )}
      </div>

      {panel.items.length === 0 ? (
        <EmptyState label={getEmptyLabel(panel)} />
      ) : (
        <div
          aria-label={`Itens da sequência ${panel.title}`}
          className={`flex min-w-0 gap-2 ${overflow === 'scroll' ? 'max-w-full overflow-x-auto pb-2' : 'flex-wrap'}`}
          data-overflow={overflow}
          data-testid='code-playback-sequence-items'
          role='list'
        >
          {panel.items.map((item, index) => {
            const highlight = getHighlight(panel, index)
            const pointers = getPointersAtIndex(panel, index)

            return (
              <div
                key={index}
                aria-label={`Item ${index}`}
                className={`flex min-w-16 max-w-full flex-col gap-1 rounded border p-2 ${highlight ? stateClassNames[highlight.state] : 'border-gray-700 bg-gray-800'}`}
                data-highlight={highlight ? 'true' : 'false'}
                data-highlight-end={highlight?.endIndex}
                data-highlight-start={highlight?.startIndex}
                data-highlight-state={highlight?.state}
                data-index={index}
                data-pointer-labels={
                  pointers.map((pointer) => pointer.label).join(',') || undefined
                }
                data-state={highlight?.state}
                role='listitem'
              >
                {panel.showIndices && (
                  <span className='text-xs font-semibold text-gray-400'>[{index}]</span>
                )}
                <ValueView value={item} overflow={overflow} />
                {pointers.length > 0 && (
                  <div
                    className='flex flex-wrap gap-1 pt-1'
                    data-testid='code-playback-item-pointers'
                  >
                    {pointers.map((pointer) => (
                      <span
                        key={pointer.label}
                        className='font-mono text-xs font-semibold text-cyan-300'
                      >
                        {pointer.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </PanelFrame>
  )
}

function ScalarPanel({
  panel,
}: {
  panel: Extract<CodePlaybackPanelDto, { type: 'scalar' }>
}) {
  return (
    <PanelFrame panel={panel}>
      <div
        className={`min-w-0 rounded border p-3 ${panel.state ? stateClassNames[panel.state] : 'border-gray-700 bg-gray-800'} ${getOverflow(panel) === 'scroll' ? 'max-w-full overflow-x-auto' : ''}`}
        data-overflow={getOverflow(panel)}
        data-testid='code-playback-scalar-value'
      >
        <ValueView
          value={panel.value}
          state={panel.state}
          overflow={getOverflow(panel)}
        />
      </div>
    </PanelFrame>
  )
}

function MapPanel({ panel }: { panel: CodePlaybackMapPanelDto }) {
  const overflow = getOverflow(panel)

  return (
    <PanelFrame panel={panel}>
      {panel.entries.length === 0 ? (
        <EmptyState label={getEmptyLabel(panel)} />
      ) : (
        <div
          aria-label={`Entradas do mapa ${panel.title}`}
          className={`min-w-0 ${overflow === 'scroll' ? 'max-w-full overflow-x-auto' : 'overflow-x-hidden'}`}
          data-overflow={overflow}
          data-testid='code-playback-map-entries'
          role='group'
        >
          <dl className='min-w-0 divide-y divide-gray-700 rounded border border-gray-700'>
            {panel.entries.map((entry, index) => (
              <div
                key={`${String(entry.key)}-${index}`}
                className={`grid min-w-0 gap-2 p-2 sm:grid-cols-[minmax(6rem,0.35fr)_minmax(0,1fr)] ${entry.state ? stateClassNames[entry.state] : ''}`}
                data-entry-index={index}
                data-state={entry.state}
              >
                <dt className='font-mono text-sm text-gray-300'>{String(entry.key)}</dt>
                <dd className='min-w-0'>
                  <ValueView
                    value={entry.value}
                    state={entry.state}
                    overflow={overflow}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </PanelFrame>
  )
}

function SetPanel({ panel }: { panel: Extract<CodePlaybackPanelDto, { type: 'set' }> }) {
  const overflow = getOverflow(panel)

  return (
    <PanelFrame panel={panel}>
      {panel.items.length === 0 ? (
        <EmptyState label={getEmptyLabel(panel)} />
      ) : (
        <div
          aria-label={`Itens do conjunto ${panel.title}`}
          className={`flex min-w-0 gap-2 ${overflow === 'scroll' ? 'max-w-full overflow-x-auto pb-2' : 'flex-wrap'}`}
          data-overflow={overflow}
          data-testid='code-playback-set-items'
          role='list'
        >
          {panel.items.map((item, index) => (
            <div
              key={index}
              className={`flex min-w-20 max-w-full items-center gap-2 rounded border p-2 ${item.state ? stateClassNames[item.state] : 'border-gray-700 bg-gray-800'}`}
              data-index={index}
              data-state={item.state}
              role='listitem'
            >
              <ValueView value={item.value} state={item.state} overflow={overflow} />
            </div>
          ))}
        </div>
      )}
    </PanelFrame>
  )
}

function GridPanel({
  panel,
}: {
  panel: Extract<CodePlaybackPanelDto, { type: 'grid' }>
}) {
  const overflow = getOverflow(panel)

  return (
    <PanelFrame panel={panel}>
      {panel.rows.length === 0 ? (
        <EmptyState label={getEmptyLabel(panel)} />
      ) : (
        <div
          aria-label={`Linhas da grade ${panel.title}`}
          className={`min-w-0 ${overflow === 'scroll' ? 'max-w-full overflow-auto' : 'overflow-x-auto'}`}
          data-overflow={overflow}
          data-testid='code-playback-grid'
          role='group'
        >
          <table className='min-w-full border-collapse text-left'>
            {panel.showIndices && (
              <thead>
                <tr>
                  <th
                    scope='col'
                    className='border border-gray-700 px-2 py-1 text-xs text-gray-400'
                  >
                    #
                  </th>
                  {panel.rows[0].map((_, columnIndex) => (
                    <th
                      key={columnIndex}
                      scope='col'
                      className='border border-gray-700 px-2 py-1 text-xs text-gray-400'
                    >
                      [{columnIndex}]
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {panel.rows.map((row, rowIndex) => (
                <tr key={rowIndex} data-row-index={rowIndex}>
                  {panel.showIndices && (
                    <th
                      scope='row'
                      className='border border-gray-700 px-2 py-2 text-xs text-gray-400'
                    >
                      [{rowIndex}]
                    </th>
                  )}
                  {row.map((item, columnIndex) => (
                    <td
                      key={columnIndex}
                      className={`min-w-20 max-w-xs border px-2 py-2 ${item.state ? stateClassNames[item.state] : 'border-gray-700 bg-gray-800'}`}
                      data-column-index={columnIndex}
                      data-state={item.state}
                    >
                      <ValueView
                        value={item.value}
                        state={item.state}
                        overflow={overflow}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PanelFrame>
  )
}

function ResultPanel({
  panel,
}: {
  panel: Extract<CodePlaybackPanelDto, { type: 'result' }>
}) {
  const overflow = getOverflow(panel)

  return (
    <PanelFrame panel={panel}>
      <div
        aria-label={`Resultado ${panel.status}`}
        className={`min-w-0 rounded border p-3 ${stateClassNames[panel.status]} ${overflow === 'scroll' ? 'max-w-full overflow-x-auto' : ''}`}
        data-overflow={overflow}
        data-status={panel.status}
        data-testid='code-playback-result'
        role='status'
      >
        <ValueView value={panel.value} overflow={overflow} />
      </div>
    </PanelFrame>
  )
}

export function CodePlaybackPanelView({ panel }: Props) {
  switch (panel.type) {
    case 'sequence':
      return <SequencePanel panel={panel} />
    case 'scalar':
      return <ScalarPanel panel={panel} />
    case 'map':
      return <MapPanel panel={panel} />
    case 'set':
      return <SetPanel panel={panel} />
    case 'grid':
      return <GridPanel panel={panel} />
    case 'result':
      return <ResultPanel panel={panel} />
  }
}
