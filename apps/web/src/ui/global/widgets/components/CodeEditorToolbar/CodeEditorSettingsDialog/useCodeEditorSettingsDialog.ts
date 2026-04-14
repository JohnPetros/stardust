import { useEditorContext } from '@/ui/global/hooks/useEditorContext'
import { DEFAULT_EDITOR_STATE } from '@/ui/global/contexts/EditorContext/constants'

export function useCodeEditorSettingsDialog() {
  const { state, dispatch } = useEditorContext()

  function handleFontSizeRangeValueChange(value: number) {
    dispatch({ type: 'setFontSize', payload: value })
  }

  function handleTabSizeRangeValueChange(value: number) {
    dispatch({ type: 'setTabSize', payload: value })
    dispatch({
      type: 'setFormatter',
      payload: {
        ...state.formatter,
        indentationSize: value,
      },
    })
  }

  function handleErrorDetectorToggle(value: boolean) {
    dispatch({ type: 'setIsCodeCheckerEnabled', payload: value })
  }

  function handleTextDelimiterChange(value: string) {
    dispatch({
      type: 'setFormatter',
      payload: {
        ...state.formatter,
        textDelimiter: value,
      },
    })
  }

  function handleMaxCharsPerLineChange(value: number) {
    dispatch({
      type: 'setFormatter',
      payload: {
        ...state.formatter,
        maxCharsPerLine: value,
      },
    })
  }

  function handleLinterToggle(value: boolean) {
    dispatch({
      type: 'setLinter',
      payload: {
        ...state.linter,
        isEnabled: value,
      },
    })
  }

  function handleNamingConventionToggle(value: boolean) {
    dispatch({
      type: 'setLinter',
      payload: {
        ...state.linter,
        namingConvention: {
          ...state.linter.namingConvention,
          isEnabled: value,
        },
      },
    })
  }

  function handleNamingConventionVariableChange(value: string) {
    dispatch({
      type: 'setLinter',
      payload: {
        ...state.linter,
        namingConvention: {
          ...state.linter.namingConvention,
          variable: value,
        },
      },
    })
  }

  function handleNamingConventionConstantChange(value: string) {
    dispatch({
      type: 'setLinter',
      payload: {
        ...state.linter,
        namingConvention: {
          ...state.linter.namingConvention,
          constant: value,
        },
      },
    })
  }

  function handleNamingConventionFunctionChange(value: string) {
    dispatch({
      type: 'setLinter',
      payload: {
        ...state.linter,
        namingConvention: {
          ...state.linter.namingConvention,
          function: value,
        },
      },
    })
  }

  function handleConsistentParadigmToggle(value: boolean) {
    dispatch({
      type: 'setLinter',
      payload: {
        ...state.linter,
        consistentParadigm: {
          ...state.linter.consistentParadigm,
          isEnabled: value,
        },
      },
    })
  }

  function handleConsistentParadigmChange(value: string) {
    dispatch({
      type: 'setLinter',
      payload: {
        ...state.linter,
        consistentParadigm: {
          ...state.linter.consistentParadigm,
          paradigm: value,
        },
      },
    })
  }

  function handleRestoreDefaults() {
    dispatch({ type: 'setFontSize', payload: DEFAULT_EDITOR_STATE.fontSize })
    dispatch({ type: 'setTabSize', payload: DEFAULT_EDITOR_STATE.tabSize })
    dispatch({
      type: 'setIsCodeCheckerEnabled',
      payload: DEFAULT_EDITOR_STATE.isCodeCheckerEnabled,
    })
    dispatch({ type: 'setFormatter', payload: DEFAULT_EDITOR_STATE.formatter })
    dispatch({ type: 'setLinter', payload: DEFAULT_EDITOR_STATE.linter })
  }

  return {
    fontSize: state.fontSize,
    tabSize: state.tabSize,
    isCodeCheckerEnabled: state.isCodeCheckerEnabled,
    formatter: state.formatter,
    linter: state.linter,
    handleTabSizeRangeValueChange,
    handleFontSizeRangeValueChange,
    handleErrorDetectorToggle,
    handleTextDelimiterChange,
    handleMaxCharsPerLineChange,
    handleLinterToggle,
    handleNamingConventionToggle,
    handleNamingConventionVariableChange,
    handleNamingConventionConstantChange,
    handleNamingConventionFunctionChange,
    handleConsistentParadigmToggle,
    handleConsistentParadigmChange,
    handleRestoreDefaults,
  }
}
