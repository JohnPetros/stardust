interface CounterBadgeProps {
  count: number
}

export function CounterBadge({ count }: CounterBadgeProps) {
  if (count > 0)
    return (
      <div className="absolute right-0 top-0 grid h-4 w-4 animate-pulse place-content-center rounded-md bg-green-400 text-xs font-semibold text-green-900">
        {count}
      </div>
    )
}
