import { Icon } from '@phosphor-icons/react'

interface FabButtonProps {
  icon: Icon
  onCLick: () => void
}

export function FabButton({ icon: Icon, onCLick }: FabButtonProps) {
  return (
    <button
      onCLick={onCLick}
      className="fixed right-24 bottom-8 grid place-content-center w-12 h-12 rounded-md border-b-2 border-green-500 bg-gray-900"
    >
      <Icon className="text-green-500 text-xl" weight="bold" />
    </button>
  )
}
