import type { Context } from 'hono'

export type HonoSchema<T> = (T extends Context<any, any, infer U> ? U : never)['in']
