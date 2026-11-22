export function TrailEmptyView() {
  return (
    <div
      role='status'
      className='mx-auto mt-24 flex w-full max-w-[440px] flex-col items-center px-6 text-center md:mt-40'
    >
      <p className='text-base text-theme-text-secondary'>
        Nenhum conteúdo disponível nesta trilha.
      </p>
    </div>
  )
}
