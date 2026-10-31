import { Code } from '@/ui/global/widgets/components/Mdx/Code'
import { Label } from '@/ui/shadcn/components/label'
import { Textarea } from '@/ui/shadcn/components/textarea'
import { useBlockContentField } from './useBlockContentField'

type Props = {
  label: string
  value: string
  onChange: (value: string) => void
}

export const BlockContentFieldView = ({ label, value, onChange }: Props) => {
  const { localValue, setLocalValue } = useBlockContentField({ value, onChange })

  if (label === 'Código') {
    return (
      <div className='space-y-2'>
        <Label>{label}</Label>
        <Code code={localValue} onChange={setLocalValue} isRunnable={true} exec={false}>
          {localValue}
        </Code>
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      <Label>{label}</Label>
      <Textarea
        value={localValue}
        rows={label === 'Código' ? 10 : 6}
        onChange={(event) => setLocalValue(event.target.value)}
        className='resize-y border-zinc-800 bg-zinc-950 text-zinc-100'
      />
    </div>
  )
}
