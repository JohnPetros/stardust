import { type ComponentProps, useId } from 'react'

import { Input } from '@/ui/shadcn/components/input'
import { Label } from '@/ui/shadcn/components/label'

type Props = {
  label: string
  errorMessage: string
} & ComponentProps<'input'>

export function InputWithError({ label, errorMessage, ...props }: Props) {
  const id = useId()
  return (
    <div className='*:not-first:mt-2'>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} className='peer' aria-invalid={Boolean(errorMessage)} {...props} />
      {errorMessage && (
        <p
          className='peer-aria-invalid:text-destructive mt-2 text-xs'
          role='alert'
          aria-live='polite'
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
}
