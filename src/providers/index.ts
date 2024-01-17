import { DateProvider } from './dateProvider'
import { EmailProvider } from './emailProvider'
import { ValidationProvider } from './validationProvider'

export function injectProviders() {
  DateProvider()
  EmailProvider()
  ValidationProvider()
}
