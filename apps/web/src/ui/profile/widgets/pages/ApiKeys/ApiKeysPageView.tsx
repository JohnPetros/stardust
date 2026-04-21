import { GoToProfilePageLink } from '../Settings/GoToProfilePageLink'
import { ApiKeyManager } from './ApiKeyManager'

export const ApiKeysPageView = () => {
  return (
    <main className='mx-auto max-w-sm px-6 pb-32 pt-8 md:max-w-6xl md:pb-12'>
      <GoToProfilePageLink />

      <div className='mt-6'>
        <ApiKeyManager />
      </div>
    </main>
  )
}
