import { DashboardPage } from '@/ui/global/widgets/pages/Dashboard'

export const meta = () => {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

const DashboardRoute = () => {
  return <DashboardPage />
}

export default DashboardRoute
