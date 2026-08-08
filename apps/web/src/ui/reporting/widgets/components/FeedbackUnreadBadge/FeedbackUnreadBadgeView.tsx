type Props = { count: number; label?: string }

export function FeedbackUnreadBadgeView({
  count,
  label = 'reportes com novas respostas',
}: Props) {
  if (count < 1) return null
  return (
    <span
      title={`${count} ${label}`}
      className='inline-flex min-w-5 items-center justify-center rounded-full bg-green-400 px-1.5 py-0.5 text-[10px] font-black text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.75)]'
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
