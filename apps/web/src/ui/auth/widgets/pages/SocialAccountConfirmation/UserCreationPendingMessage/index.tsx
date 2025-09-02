import { UserCreationPendingMessageView } from './UserCreationPendingMessageView'
import { useUserCreationPendingMessage } from './useUserCreationPendingMessage'

export const UserCreationPendingMessage = () => {
  const { quote, handleAnimationComplete } = useUserCreationPendingMessage()

  return (
    <UserCreationPendingMessageView
      quote={quote}
      handleAnimationComplete={handleAnimationComplete}
    />
  )
}
