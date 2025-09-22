import { useEditorContext } from '@/ui/global/hooks/useEditorContext'

export function useCodeEditorSettingsDialog() {
  const { state, dispatch } = useEditorContext()

  function handleFontSizeRangeValueChange(value: number) {
    dispatch({ type: 'setFontSize', payload: value })
  }

  function handleTabSizeRangeValueChange(value: number) {
    dispatch({ type: 'setTabSize', payload: value })
  }

  function handleErrorDetectorToggle(value: boolean) {
    dispatch({ type: 'setIsCodeCheckerEnabled', payload: value })
  }

  return {
    fontSize: state.fontSize,
    tabSize: state.tabSize,
    isCodeCheckerEnabled: state.isCodeCheckerEnabled,
    handleTabSizeRangeValueChange,
    handleFontSizeRangeValueChange,
    handleErrorDetectorToggle,
  }
}
