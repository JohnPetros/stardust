import { z } from 'zod'

const internalPathPattern = /^\/(?!\/)(?!auth\/(?:sign-in|sign-up)(?:[/?#]|$))[^\\\s]*$/

export const nextRouteSchema = z
  .string({ required_error: 'rota de retorno é obrigatória' })
  .min(1, 'rota de retorno é obrigatória')
  .regex(internalPathPattern, 'rota de retorno deve ser um caminho interno permitido')

export const feedbackNextRouteSchema = nextRouteSchema
