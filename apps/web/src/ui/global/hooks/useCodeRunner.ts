import {
  DeleguaCodeRunnerProvider,
  obtenhaConfiguracaoDeleguaParaEditorMonaco,
} from '@/code-runner'

export function useCodeRunner() {
  return {
    id: 'delegua',
    getMonacoEditorConfig() {
      return obtenhaConfiguracaoDeleguaParaEditorMonaco()
    },
    provider: DeleguaCodeRunnerProvider(),
  }
}
