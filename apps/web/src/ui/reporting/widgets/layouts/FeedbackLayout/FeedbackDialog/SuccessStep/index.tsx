import { SuccessStep as View } from './SuccessStepView'

type Props = {
  onReset: () => void
}

export const SuccessStep = (props: Props) => {
  return <View {...props} />
}
