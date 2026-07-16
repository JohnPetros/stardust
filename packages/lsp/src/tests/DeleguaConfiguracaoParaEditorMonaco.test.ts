import { deepStrictEqual } from 'node:assert'
import { describe, it } from 'node:test'

import { DeleguaConfiguracaoParaEditorMonaco } from '../DeleguaConfiguracaoParaEditorMonaco'

describe('DeleguaConfiguracaoParaEditorMonaco', () => {
  it('deve envolver selecoes com aspas e delimitadores', () => {
    const configuracao = new DeleguaConfiguracaoParaEditorMonaco()

    deepStrictEqual(configuracao.obterConfiguracaoDeLinguagem().surroundingPairs, [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: "'", close: "'" },
      { open: '"', close: '"' },
      { open: '`', close: '`' },
    ])
  })
})
