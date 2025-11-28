import { BlurText } from '@/ui/global/widgets/components/BlurText'

type Props = {
  quote: string
  handleAnimationComplete: () => void
}

export const UserCreationPendingMessageView = ({
  quote,
  handleAnimationComplete,
}: Props) => {
  return (
    <div>
      <BlurText
        text={quote}
        delay={200}
        onAnimationComplete={handleAnimationComplete}
        className='text-center text-lg text-gray-500'
      />
    </div>
  )
}
