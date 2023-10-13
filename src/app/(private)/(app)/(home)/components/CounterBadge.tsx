interface CounterBadgeProps {
  count: number
}

export function CounterBadge({ count }: CounterBadgeProps) {
  if (count > 0)
    return (
      <div className="absolute right-0 top-0 grid h-4 w-4 animate-ping place-content-center rounded-md bg-green-400/90 text-sm font-semibold text-green-900">
        {count}
      </div>
    )
}
