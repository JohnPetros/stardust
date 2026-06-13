export type AnalyticsEventDto = {
  name: string
  distinctId: string
  insertId: string
  properties: Record<string, unknown>
}
