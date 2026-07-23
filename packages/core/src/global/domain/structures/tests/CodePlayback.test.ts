import { ValidationError } from '../../errors'
import { CodePlayback } from '../CodePlayback'
import { CodePlaybacksFaker } from '../fakers/CodePlaybacksFaker'

describe('CodePlayback', () => {
  it('creates and round-trips the normative fixture without changing order', () => {
    const playback = CodePlayback.create(CodePlaybacksFaker.fakeDto())

    expect(playback.dto).toEqual(CodePlaybacksFaker.fakeDto())
  })

  it('validates steps, lines, panels and finite values', () => {
    expect(() =>
      CodePlayback.create({ ...CodePlaybacksFaker.fakeDto(), steps: [] }),
    ).toThrow(ValidationError)
    expect(() =>
      CodePlayback.create({
        ...CodePlaybacksFaker.fakeDto(),
        steps: [
          {
            ...CodePlaybacksFaker.fakeDto().steps[0],
            activeLineRanges: [{ startLine: 0, endLine: 1 }],
          },
        ],
      }),
    ).toThrow(ValidationError)
    expect(() =>
      CodePlayback.create({
        ...CodePlaybacksFaker.fakeDto(),
        steps: [
          {
            ...CodePlaybacksFaker.fakeDto().steps[0],
            panels: [{ type: 'scalar', title: 'X', value: Number.NaN }],
          },
        ],
      }),
    ).toThrow(ValidationError)
  })

  it('validates labels, pointers, highlights and rectangular grids', () => {
    const dto = CodePlaybacksFaker.fakeDto()
    const sequence = dto.steps[0].panels[0]
    if (sequence.type !== 'sequence') throw new Error('fixture sequence expected')

    expect(() =>
      CodePlayback.create({
        ...dto,
        steps: [
          {
            ...dto.steps[0],
            panels: [{ ...sequence, pointers: [{ label: ' ', index: 0 }] }],
          },
        ],
      }),
    ).toThrow(ValidationError)
    expect(() =>
      CodePlayback.create({
        ...dto,
        steps: [
          {
            ...dto.steps[0],
            panels: [
              {
                ...sequence,
                highlights: [
                  { startIndex: 0, endIndex: 1, state: 'active' },
                  { startIndex: 1, endIndex: 1, state: 'visited' },
                ],
              },
            ],
          },
        ],
      }),
    ).toThrow(ValidationError)
    expect(() =>
      CodePlayback.create({
        ...dto,
        steps: [
          {
            ...dto.steps[0],
            panels: [
              {
                type: 'grid',
                title: 'GRID',
                rows: [[{ value: 1 }], [{ value: 2 }, { value: 3 }]],
                showIndices: true,
              },
            ],
          },
        ],
      }),
    ).toThrow(ValidationError)
  })

  it('accepts empty collections and preserves metadata', () => {
    const dto = CodePlaybacksFaker.fakeDto()
    dto.steps[0].panels = [
      { type: 'map', title: 'MAPA', entries: [], emptyLabel: 'Vazio' },
      { type: 'set', title: 'CONJUNTO', items: [] },
      { type: 'grid', title: 'GRADE', rows: [], showIndices: true },
      { type: 'result', title: 'RESULTADO', value: null, status: 'neutral' },
    ]

    expect(CodePlayback.create(dto).dto).toEqual(dto)
  })

  it('returns defensive copies on creation and dto access', () => {
    const dto = CodePlaybacksFaker.fakeDto()
    const playback = CodePlayback.create(dto)
    dto.steps[0].explanation = 'alterado'
    dto.steps[0].panels[0].title = 'alterado'

    const first = playback.dto
    first.steps[0].explanation = 'alterado novamente'
    first.steps[0].panels[0].title = 'alterado novamente'

    expect(playback.dto.steps[0].explanation).toBe('Calcula o resultado.')
    expect(playback.dto.steps[0].panels[0].title).toBe('VALORES')
  })

  it('rejects cyclic values', () => {
    const dto = CodePlaybacksFaker.fakeDto()
    const cyclic = {} as Record<string, unknown>
    cyclic.self = cyclic
    const panel = dto.steps[0].panels[0]
    if (panel.type !== 'sequence') throw new Error('fixture sequence expected')
    panel.items = [cyclic as never]

    expect(() => CodePlayback.create(dto)).toThrow(ValidationError)
  })

  it('rejects sparse arrays and values that JSON cannot preserve', () => {
    const sparseDto = CodePlaybacksFaker.fakeDto()
    const sparse = new Array<unknown>(1)
    const sparsePanel = sparseDto.steps[0].panels[0]
    if (sparsePanel.type !== 'sequence') throw new Error('fixture sequence expected')
    sparsePanel.items = sparse as never

    expect(() => CodePlayback.create(sparseDto)).toThrow(ValidationError)

    const symbolKeyDto = CodePlaybacksFaker.fakeDto()
    const symbolKey = Symbol('key')
    const objectWithSymbolKey = { value: 1 } as Record<string | symbol, unknown>
    objectWithSymbolKey[symbolKey] = 2
    const symbolKeyPanel = symbolKeyDto.steps[0].panels[0]
    if (symbolKeyPanel.type !== 'sequence') throw new Error('fixture sequence expected')
    symbolKeyPanel.items = [objectWithSymbolKey as never]

    expect(() => CodePlayback.create(symbolKeyDto)).toThrow(ValidationError)

    const symbolValueDto = CodePlaybacksFaker.fakeDto()
    const symbolValuePanel = symbolValueDto.steps[0].panels[0]
    if (symbolValuePanel.type !== 'sequence') throw new Error('fixture sequence expected')
    symbolValuePanel.items = [Symbol('value') as never]

    expect(() => CodePlayback.create(symbolValueDto)).toThrow(ValidationError)
  })

  it('rejects sparse structural collections and structural extras', () => {
    const expectInvalid = (
      mutate: (dto: ReturnType<typeof CodePlaybacksFaker.fakeDto>) => void,
    ) => {
      const dto = CodePlaybacksFaker.fakeDto()
      mutate(dto)
      expect(() => CodePlayback.create(dto)).toThrow(ValidationError)
    }

    expectInvalid((dto) => {
      dto.steps = new Array(1) as never
    })
    expectInvalid((dto) => {
      dto.steps[0].activeLineRanges = new Array(1) as never
    })
    expectInvalid((dto) => {
      dto.steps[0].panels = new Array(1) as never
    })
    expectInvalid((dto) => {
      const panel = dto.steps[0].panels[0]
      if (panel.type !== 'sequence') throw new Error('fixture sequence expected')
      panel.pointers = new Array(1) as never
    })
    expectInvalid((dto) => {
      const panel = dto.steps[0].panels[0]
      if (panel.type !== 'sequence') throw new Error('fixture sequence expected')
      panel.highlights = new Array(1) as never
    })
    expectInvalid((dto) => {
      dto.steps[0].panels = [
        { type: 'map', title: 'MAPA', entries: new Array(1) as never },
      ]
    })
    expectInvalid((dto) => {
      dto.steps[0].panels = [{ type: 'set', title: 'SET', items: new Array(1) as never }]
    })
    expectInvalid((dto) => {
      dto.steps[0].panels = [
        { type: 'grid', title: 'GRID', rows: new Array(1) as never, showIndices: true },
      ]
    })
    expectInvalid((dto) => {
      dto.steps[0].panels = [
        { type: 'grid', title: 'GRID', rows: [new Array(1) as never], showIndices: true },
      ]
    })
    expectInvalid((dto) => {
      ;(dto as unknown as Record<string, unknown>).unexpected = true
    })
    expectInvalid((dto) => {
      const symbolKey = Symbol('input')
      ;(dto.input as unknown as Record<PropertyKey, unknown>)[symbolKey] = true
    })
    expectInvalid((dto) => {
      const panel = dto.steps[0].panels[0]
      ;(panel as unknown as Record<string, unknown>).unexpected = true
    })
    expectInvalid((dto) => {
      ;(dto.input as unknown as Record<string, unknown>).content = undefined
    })
    expectInvalid((dto) => {
      const panel = dto.steps[0].panels[0]
      ;(panel as unknown as Record<string, unknown>).overflow = undefined
    })
  })
})
