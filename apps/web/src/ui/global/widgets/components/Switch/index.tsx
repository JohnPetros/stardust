'use client'

import { useSwitch } from './useSwitch'
import { SwitchView } from './SwitchView'

type Props = {
  label?: string
  name?: string
  value?: string
  defaultCheck?: boolean
  isDisabled?: boolean
  className?: string
  onCheck: (isChecked: boolean) => void
}

export const Switch = ({
  onCheck,
  label,
  name,
  value,
  defaultCheck = false,
  isDisabled = false,
  className,
}: Props) => {
  const { isChecked, handleCheckChange } = useSwitch(defaultCheck, onCheck)

  return (
    <SwitchView
      label={label}
      name={name}
      value={value}
      isDisabled={isDisabled}
      className={className}
      isChecked={isChecked}
      defaultChecked={defaultCheck}
      onCheck={handleCheckChange}
    />
  )
}
