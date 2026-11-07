import type { UseFormRegisterReturn } from 'react-hook-form'

import { Input } from '@/ui/global/widgets/components/Input'
import { AnimatedContainer } from '../AnimatedContainer'

export type NameFieldViewProps = {
  errorMessage: string
  isValid: boolean
  registration: UseFormRegisterReturn
}

export const NameFieldView = ({
  errorMessage,
  isValid,
  registration,
}: NameFieldViewProps) => {
  return (
    <AnimatedContainer>
      <Input
        testId='name-input'
        label='Nome de usuário'
        type='text'
        icon='lock'
        placeholder='Digite seu nome de usuário'
        isActive={isValid}
        autoFocus
        errorMessage={errorMessage}
        {...registration}
      />
      {!isValid && (
        <p
          data-testid='name-input-error'
          className='mt-3 text-sm text-theme-text-secondary'
        >
          Pelo menos 3 caracteres
        </p>
      )}
    </AnimatedContainer>
  )
}
