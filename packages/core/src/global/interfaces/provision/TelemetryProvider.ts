export interface TelemetryProvider {
  trackError(error: Error): void
}
