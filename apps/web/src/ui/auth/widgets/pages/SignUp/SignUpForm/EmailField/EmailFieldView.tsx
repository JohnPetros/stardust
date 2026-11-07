import type { UseFormRegisterReturn } from 'react-hook-form'

import { Input } from '@/ui/global/widgets/components/Input'
import { AnimatedContainer } from '../AnimatedContainer'

export type EmailFieldViewProps = {
  errorMessage: string
  isValid: boolean
  registration: UseFormRegisterReturn
}

export const EmailFieldView = ({
  errorMessage,
  isValid,
  registration,
}: EmailFieldViewProps) => {
  return (
    <AnimatedContainer>
      <Input
        testId='email-input'
        label='E-mail'
        type='email'
        icon='mail'
        placeholder='Digite seu e-mail'
        isActive={isValid}
        errorMessage={errorMessage}
        {...registration}
      />
      {!isValid && (
        <p
          data-testid='email-input-error'
          className='mt-3 text-sm text-theme-text-secondary'
        >
          E-mail válido, por favor
        </p>
      )}
    </AnimatedContainer>
  )
}
