import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { AssistantGreetingView } from './AssistantGreetingView'

export const AssistantGreeting = () => {
  const { user } = useAuthContext()

  if (!user) return null
  return <AssistantGreetingView userName={user.name.value} />
}
