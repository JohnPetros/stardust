import type { EditorContextState } from '../types'

export const DEFAULT_EDITOR_STATE: EditorContextState = {
  themeName: 'darkSpace',
  fontSize: 16,
  tabSize: 4,
  isCodeCheckerEnabled: true,
  formatter: {
    textDelimiter: 'preserve',
    maxCharsPerLine: 100,
    indentationSize: 4,
  },
  linter: {
    isEnabled: true,
    namingConvention: {
      isEnabled: false,
      variable: 'caixaCamelo',
      constant: 'CAIXA_ALTA',
      function: 'caixaCamelo',
    },
    consistentParadigm: {
      isEnabled: false,
      paradigm: 'both',
    },
  },
}
