import { CodeInputView } from './CodeInputView'
import { useCodeInput } from './useCodeInput'

type Props = {
  value?: string
  onChange: (code: string) => void
  onDisable: () => void
  onEnable: (defaultCode: string) => void
}

export const CodeInput = ({ value, onChange, onDisable, onEnable }: Props) => {
  const { defaultCode, isEnabled, handleDisableButtonClick, handleEnableButtonClick } =
    useCodeInput({
      isEnabledDefault: Boolean(value),
      onChange,
      onDisable,
      onEnable,
    })

  return (
    <CodeInputView
      defaultValue={defaultCode}
      value={value}
      isEnabled={isEnabled}
      onChange={onChange}
      onDisableButtonClick={handleDisableButtonClick}
      onEnableButtonClick={handleEnableButtonClick}
    />
  )
}
