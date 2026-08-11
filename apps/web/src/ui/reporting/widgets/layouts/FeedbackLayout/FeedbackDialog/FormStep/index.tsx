import { FormStepView, type FormStepViewProps } from './FormStepView'
import { useFeedbackFormStep } from './useFeedbackFormStep'

type Props = Omit<FormStepViewProps, 'metadata' | 'onFileInputChange'> & {
  intent: string
  onSelectFile: (file: File) => void
}

export function FormStep({ intent, onSelectFile, ...props }: Props) {
  const { metadata, handleFileInputChange } = useFeedbackFormStep({
    intent,
    onSelectFile,
  })

  return (
    <FormStepView
      {...props}
      metadata={metadata}
      onFileInputChange={handleFileInputChange}
    />
  )
}
