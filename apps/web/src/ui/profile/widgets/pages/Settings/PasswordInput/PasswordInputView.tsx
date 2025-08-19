import { ROUTES } from '@/constants'
import Link from 'next/link'

export const PasswordInputView = () => {
  return (
    <div className='grid grid-cols-3 border-b border-gray-700 py-4'>
      <label htmlFor='name' className='text-sm text-gray-100'>
        Senha
      </label>

      <Link href={ROUTES.auth.resetPassword} className='text-green-400'>
        Redefinir Senha
      </Link>
    </div>
  )
}
