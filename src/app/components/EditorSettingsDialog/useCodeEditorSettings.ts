import { useCodeEditorContext } from '@/contexts/CodeEditorContext'

export function useCodeEditorSettings() {
  const { state, dispatch } = useCodeEditorContext()

  function handleFontSizeRangeValueChange([value]: number[]) {
    dispatch({ type: 'setFontSize', payload: value })
  }

  function handleTabSizeRangeValueChange([value]: number[]) {
    dispatch({ type: 'setTabSize', payload: value })
  }

  return {
    fontSize: state.fontSize,
    tabSize: state.tabSize,
    handleTabSizeRangeValueChange,
    handleFontSizeRangeValueChange,
  }
}
