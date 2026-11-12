import { useSignInForm } from './useSignInForm'
import { SignInFormView } from './SignInFormView'
import type { SignInFormFields } from './types/SignInFormFields'

type SignInFormProps = {
  onSubmit: (fields: SignInFormFields) => Promise<void>
  unconfirmedEmail: string | null
  isResendingEmail: boolean
  onResendEmail: () => Promise<void>
}

export function SignInForm({
  onSubmit,
  unconfirmedEmail,
  isResendingEmail,
  onResendEmail,
}: SignInFormProps) {
  const { errors, isLoading, register, handleSubmit } = useSignInForm(onSubmit)

  return (
    <SignInFormView
      errors={errors}
      isLoading={isLoading}
      register={register}
      handleSubmit={handleSubmit}
      unconfirmedEmail={unconfirmedEmail}
      isResendingEmail={isResendingEmail}
      onResendEmail={onResendEmail}
    />
  )
}
