import { Icon } from '@phosphor-icons/react'

interface IconButtonProps {
  icon: Icon
  onClick: VoidFunction
}

export function IconButton({ icon: Icon, onClick }: IconButtonProps) {
  return (
    <button className='grid place-content-center' onClick={onClick}>
      <Icon className="text-green-500 text-xl" weight="bold" />
    </button>
  )
}
