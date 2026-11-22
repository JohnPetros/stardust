const PLACEHOLDERS = ['first', 'second', 'third'] as const

export function TrailLoadingView() {
  return (
    <div role='status' className='mx-auto mt-8 flex w-full max-w-[520px] flex-col px-6'>
      <p className='text-[14px] text-theme-text-secondary'>Carregando trilha…</p>

      <ul aria-hidden='true' className='mt-8 flex flex-col gap-8'>
        {PLACEHOLDERS.map((placeholder) => (
          <li key={placeholder} className='flex items-center gap-3'>
            <div className='h-[100px] w-[100px] shrink-0 rounded-full bg-theme-surface motion-safe:animate-pulse' />
            <div className='flex w-full max-w-[220px] flex-col gap-3 rounded-theme border border-theme-border-quiet bg-theme-surface p-4'>
              <div className='h-[18px] w-[140px] rounded-theme bg-theme-border-quiet motion-safe:animate-pulse' />
              <div className='h-[12px] w-full rounded-theme bg-theme-border-quiet motion-safe:animate-pulse' />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
