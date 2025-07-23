import { Icon } from '@/ui/global/widgets/components/Icon'
import { SignInFormView } from './SignInForm/SignInFormView'

export const SignInPageView = () => {
  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <div className='flex items-center gap-2 self-center font-medium'>
          <div className='grid place-items-center bg-primary rounded-2xl p-2'>
            <Icon name='rocket' className='text-green-400' />
          </div>
          <img src='/images/logo.svg' alt='logo' className='w-32 h-auto' />
          <span className='text-zinc-300 font-medium'>Studio</span>
        </div>
        <SignInFormView />
      </div>
    </div>
  )
}
