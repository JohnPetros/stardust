type Props = {
  label: string
}

export const OptionsDividerView = ({ label }: Props) => {
  return (
    <div data-testid='options-divider' className='flex w-full items-center gap-2'>
      <span
        data-testid='options-divider-line'
        aria-hidden='true'
        className='h-px flex-1 bg-theme-border-quiet'
      />
      <span className='text-base font-normal text-theme-text-secondary'>{label}</span>
      <span
        data-testid='options-divider-line'
        aria-hidden='true'
        className='h-px flex-1 bg-theme-border-quiet'
      />
    </div>
  )
}
