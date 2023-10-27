import { Space } from './components/Space'

import { SpaceProvider } from '@/contexts/SpaceContext'

export default function Home() {
  return (
    <SpaceProvider>
      <Space />
    </SpaceProvider>
  )
}
