import { InitialStep as View } from './InitialStepView'

type Props = {
  onSelectIntent: (intent: string) => void
}

export function InitialStep(props: Props) {
  return <View {...props} />
}
