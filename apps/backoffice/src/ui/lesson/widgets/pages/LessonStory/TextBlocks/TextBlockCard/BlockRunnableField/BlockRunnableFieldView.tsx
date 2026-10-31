import { Toggle } from '@/ui/global/widgets/components/Toggle'

type Props = {
  isRunnable: boolean
  onChange: (isRunnable: boolean) => void
}

export const BlockRunnableFieldView = ({ isRunnable, onChange }: Props) => {
  return (
    <div className='rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3'>
      <Toggle
        label='Permitir execução do código'
        defaultChecked={isRunnable}
        onCheck={onChange}
      />
    </div>
  )
}
