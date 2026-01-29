type Props = {
  children: React.ReactNode
  className?: string
}

export const DialogTitle = ({ children, className }: Props) => {
  return <DialogTitle className={className}>{children}</DialogTitle>
}
