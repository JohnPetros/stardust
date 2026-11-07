import type { UseFormRegisterReturn } from 'react-hook-form'

import { Input } from '@/ui/global/widgets/components/Input'
import { AnimatedContainer } from '../AnimatedContainer'

export type PasswordFieldViewProps = {
  isValid: boolean
  registration: UseFormRegisterReturn
}

export const PasswordFieldView = ({ isValid, registration }: PasswordFieldViewProps) => {
  return (
    <AnimatedContainer>
      <div className='space-y-4'>
        <Input
          testId='password-input'
          label='Senha'
          type='password'
          icon='lock'
          placeholder='Digite sua senha'
          isActive={isValid}
          {...registration}
        />
        {!isValid && (
          <p
            data-testid='password-input-error'
            className='text-sm leading-6 tracking-wider text-theme-text-secondary'
          >
            Senha deve conter pelo menos 6 caracteres 😙.
          </p>
        )}
      </div>
    </AnimatedContainer>
  )
}
