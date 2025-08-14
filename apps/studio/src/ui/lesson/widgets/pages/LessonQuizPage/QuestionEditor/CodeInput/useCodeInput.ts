import { useState } from 'react'

const DEFAULT_VALUE = 'escreva("Olá, mundo!")'

type Params = {
  isEnabledDefault: boolean
  onChange: (code: string) => void
  onDisable: () => void
  onEnable: (defaultCode: string) => void
}

export function useCodeInput({
  isEnabledDefault,
  onChange,
  onDisable,
  onEnable,
}: Params) {
  const [isEnabled, setIsEnabled] = useState(isEnabledDefault)

  function handleChange(code: string) {
    onChange(code)
  }

  function handleDisableButtonClick() {
    setIsEnabled(false)
    onDisable()
  }

  function handleEnableButtonClick() {
    setIsEnabled(true)
    onEnable(DEFAULT_VALUE)
  }

  return {
    defaultCode: DEFAULT_VALUE,
    isEnabled,
    handleChange,
    handleDisableButtonClick,
    handleEnableButtonClick,
  }
}
