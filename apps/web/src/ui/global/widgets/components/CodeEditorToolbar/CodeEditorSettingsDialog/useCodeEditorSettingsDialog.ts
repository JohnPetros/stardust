import { useEditorContext } from '@/ui/global/contexts/EditorContext/hooks'

export function useCodeEditorSettingsDialog() {
  const { state, dispatch } = useEditorContext()

  function handleFontSizeRangeValueChange(value: number) {
    dispatch({ type: 'setFontSize', payload: value })
  }

  function handleTabSizeRangeValueChange(value: number) {
    dispatch({ type: 'setTabSize', payload: value })
  }

  return {
    fontSize: state.fontSize,
    tabSize: state.tabSize,
    handleTabSizeRangeValueChange,
    handleFontSizeRangeValueChange,
  }
}
