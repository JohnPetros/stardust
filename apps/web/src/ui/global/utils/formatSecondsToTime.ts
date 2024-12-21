export function formatSecondsToTime(seconds: number) {
  const date = new Date(0)
  date.setSeconds(seconds)

  const time = date.toISOString().substring(14, 19)
  return time
}
