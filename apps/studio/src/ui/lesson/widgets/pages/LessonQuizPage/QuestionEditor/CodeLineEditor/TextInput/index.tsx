import { TextInputView } from './TextInputView'
import { useTextInput } from './useTextInput'

type Props = {
  defaultValue: string
  onBlur: (value: string) => void
}

export const TextInput = ({ defaultValue, onBlur }: Props) => {
  const { value, handleChange } = useTextInput(defaultValue)

  return <TextInputView value={value} onChange={handleChange} onBlur={onBlur} />
}
