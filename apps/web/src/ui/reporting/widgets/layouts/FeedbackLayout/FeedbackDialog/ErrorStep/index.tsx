import { ErrorStepView } from './ErrorStepView'

type Props = {
  onRetry: () => void
}

export const ErrorStep = (props: Props) => {
  return <ErrorStepView {...props} />
}
