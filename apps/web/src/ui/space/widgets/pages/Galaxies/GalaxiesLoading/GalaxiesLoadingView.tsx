import { twMerge } from 'tailwind-merge'

const PLACEHOLDERS = [
  { id: 'first', side: 'start', plaqueClassName: 'min-h-[227px] lg:min-h-[235px]' },
  { id: 'second', side: 'end', plaqueClassName: 'min-h-[171px] lg:min-h-[178px]' },
] as const

const LINES = [
  'h-[28px] w-[200px]',
  'h-[14px] w-full',
  'h-[14px] w-[240px] max-w-full',
  'h-[8px] w-full',
  'h-[14px] w-[120px]',
]

export function GalaxiesLoadingView() {
  return (
    <div role='status' className='mt-[8px] flex flex-col'>
      <p className='max-w-[520px] text-[14px] text-theme-text-secondary'>
        Carregando galáxias…
      </p>

      <ul aria-hidden='true' className='mt-[32px] flex flex-col gap-[32px] lg:gap-[20px]'>
        {PLACEHOLDERS.map((placeholder, index) => (
          <li
            key={placeholder.id}
            className={twMerge(
              'flex flex-col lg:w-[632px] lg:flex-row lg:items-center lg:gap-[32px]',
              index === 0 ? 'lg:ml-[72px]' : 'lg:ml-auto lg:mr-[48px]',
            )}
          >
            <div
              className={twMerge(
                'relative z-0 -mb-[36px] flex h-[180px] w-[180px] shrink-0 items-center justify-center lg:mb-0 lg:h-[260px] lg:w-[260px]',
                placeholder.side === 'start'
                  ? 'ml-[8px] lg:ml-0'
                  : 'ml-auto mr-[8px] lg:mr-0',
              )}
            >
              <div className='h-full w-full rounded-full bg-theme-surface motion-safe:animate-pulse lg:h-[200px] lg:w-[200px]' />
            </div>

            <div
              className={twMerge(
                'relative z-10 flex w-full flex-col gap-[12px] rounded-theme border border-theme-border-quiet bg-theme-surface p-[24px] lg:w-[340px]',
                placeholder.plaqueClassName,
              )}
            >
              {LINES.map((lineClassName) => (
                <div
                  key={lineClassName}
                  className={twMerge(
                    'rounded-theme bg-theme-border-quiet motion-safe:animate-pulse',
                    lineClassName,
                  )}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
