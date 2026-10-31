import { useLoaderData } from 'react-router'
import { HeaderView } from './HeaderView'
import type { clientLoader } from '@/app/layouts/AppLayout'

export const Header = () => {
  const { account } = useLoaderData<typeof clientLoader>()
  return <HeaderView account={account} />
}
