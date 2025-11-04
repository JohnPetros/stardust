type Props = {
  text: string
  isDisabled?: boolean
  speed?: number
  className?: string
}

export const ShinyTextView = ({ text, className, isDisabled, speed = 0.5 }: Props) => {
  const animationDuration = `${speed}s`

  return (
    <div
      className={`shiny-text ${isDisabled ? 'disabled' : ''} ${className}`}
      style={{ animationDuration }}
    >
      {text}
    </div>
  )
}
