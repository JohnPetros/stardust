type AppErrorProps = {
  error: unknown
}

export function AppError({ error }: AppErrorProps) {
  if (error instanceof Error) return <p>{error.message}</p>
}
