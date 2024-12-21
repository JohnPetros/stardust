import { DeleguaCodeRunnerProvider } from './delegua'
import { obtenhaConfiguracaoDeleguaParaEditorMonaco } from './delegua/utils'

export function useCodeRunner() {
  return {
    id: 'delegua',
    getMonacoEditorConfig() {
      return obtenhaConfiguracaoDeleguaParaEditorMonaco()
    },
    provider: DeleguaCodeRunnerProvider(),
  }
}
