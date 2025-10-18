import { Label } from '@/ui/shadcn/components/label'
import { Switch } from '@/ui/shadcn/components/switch'
import { useId } from 'react'

type Props = {
  label: string
  name?: string
  value?: string
  className?: string
  defaultChecked?: boolean
  onCheck: (isChecked: boolean) => void
}

export const ToggleView = ({
  label,
  name,
  value,
  defaultChecked,
  className,
  onCheck,
}: Props) => {
  const id = useId()

  return (
    <div className='flex items-center space-x-2'>
      <Switch
        id={id}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className={className}
        onCheckedChange={onCheck}
      />
      <Label htmlFor={id} className='text-sm text-zinc-500'>
        {label}
      </Label>
    </div>
  )
}
