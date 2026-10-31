export interface ControlMeta {
  sid: string
  label?: string
  min?: number
  max?: number
  step?: number
  /** Extra slot ids this control also writes to (hidden from the panel). See player-contract.md. */
  targetSids?: string[]
}
