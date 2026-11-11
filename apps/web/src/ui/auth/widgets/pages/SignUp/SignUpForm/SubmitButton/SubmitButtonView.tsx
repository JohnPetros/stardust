import { Button } from '@/ui/global/widgets/components/Button'
import { AnimatedContainer } from '../AnimatedContainer'

export type SubmitButtonViewProps = {
  isSubmitting: boolean
}

export const SubmitButtonView = ({ isSubmitting }: SubmitButtonViewProps) => {
  return (
    <AnimatedContainer>
      <Button
        testId='submit-button'
        type='submit'
        className='mt-6'
        isLoading={isSubmitting}
      >
        Criar conta
      </Button>
    </AnimatedContainer>
  )
}
