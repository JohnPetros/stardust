import { GoogleAccountButton } from './GoogleAccountButton'
import { GithubAccountButton } from './GithubAccountButton'
import { Separator } from '@/ui/global/widgets/components/Separator'

export const SocialAccountsView = () => {
  return (
    <div>
      <h2 className='text-gray-100 font-semibold text-lg'>Contas Sociais</h2>
      <div className='mt-10 space-y-4'>
        <GoogleAccountButton />
        <Separator className='bg-gray-700 w-full' />
        <GithubAccountButton />
      </div>
    </div>
  )
}
