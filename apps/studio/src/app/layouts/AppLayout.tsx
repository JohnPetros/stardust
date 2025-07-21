import { Outlet } from 'react-router'

import { AppLayout as Layout } from '@/ui/global/widgets/layouts/App'

const AppLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default AppLayout
