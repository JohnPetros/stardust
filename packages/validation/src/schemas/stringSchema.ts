import { z } from 'zod'
import { ERROR_MESSAGES } from '../constants'

export const stringSchema = z.string({ required_error: ERROR_MESSAGES.nonempty })
