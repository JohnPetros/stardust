import { useEditorContext } from '@/contexts/EditorContext/hooks/useEditorContext'

export function useCodeEditorSettingsDialog() {
  const { state, dispatch } = useEditorContext()

  console.log({ state })

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
