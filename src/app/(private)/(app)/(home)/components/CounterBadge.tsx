interface CounterBadgeProps {
  count: number
}

export function CounterBadge({ count }: CounterBadgeProps) {
  if (count > 0)
    return (
      <div className="grid place-content-center bg-green-400/90 w-4 h-4 font-semibold text-green-900 text-sm rounded-md absolute top-0 right-0 animate-ping">
        {count}
      </div>
    )
}
