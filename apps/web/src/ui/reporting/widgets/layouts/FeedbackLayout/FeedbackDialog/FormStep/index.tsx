import { FormStep as View } from './FormStepView'

type Props = {
  intent: string
  content: string
  onContentChange: (content: string) => void
  screenshotPreview?: string
  isLoading: boolean
  onCapture: () => void
  onDeleteScreenshot: () => void
  onSubmit: () => void
}

export const FormStep = (props: Props) => {
  return <View {...props} />
}
