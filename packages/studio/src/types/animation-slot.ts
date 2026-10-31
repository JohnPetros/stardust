export type AnimationSlot =
  | { id: string; type: 'scalar'; value: number }
  | { id: string; type: 'color'; value: [number, number, number, number] }
  | { id: string; type: 'vec2'; value: [number, number] }
  | { id: string; type: 'text'; value: string }
