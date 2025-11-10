import '../ui/global/styles/global.css'

import { RootLayout } from '@/ui/global/widgets/layouts/Root'

type Props = {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  return <RootLayout>{children}</RootLayout>
}

export default Layout
