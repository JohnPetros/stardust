import { CodePlayback } from '../CodePlayback'
import type { CodePlaybackDto } from '../dtos/CodePlaybackDto'

export class CodePlaybacksFaker {
  static fakeDto(overrides?: Partial<CodePlaybackDto>): CodePlaybackDto {
    const dto: CodePlaybackDto = {
      code: 'var resultado = 2 + 2\nimprimir(resultado)',
      input: { content: 'sem entrada', overflow: 'wrap' },
      steps: [
        {
          activeLineRanges: [{ startLine: 1, endLine: 1 }],
          explanation: 'Calcula o resultado.',
          panels: [
            {
              type: 'sequence',
              title: 'VALORES',
              kind: 'array',
              items: [2, 2],
              showIndices: true,
              pointers: [{ label: 'i', index: 0 }],
              highlights: [{ startIndex: 0, endIndex: 1, state: 'active' }],
            },
            { type: 'scalar', title: 'RESULTADO', value: 4, state: 'active' },
          ],
        },
      ],
      ...overrides,
    }

    return CodePlayback.create(dto).dto
  }

  static fake(overrides?: Partial<CodePlaybackDto>): CodePlayback {
    return CodePlayback.create(CodePlaybacksFaker.fakeDto(overrides))
  }
}
