import { SuccessStepView } from './SuccessStepView'

type Props = {
  onClose: () => void
}

export const SuccessStep = (props: Props) => {
  return <SuccessStepView {...props} />
}
