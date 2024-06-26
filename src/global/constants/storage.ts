import { APP_PREFIX } from './app-prefix'

export const STORAGE = {
  keys: {
    editorConfig: `${APP_PREFIX}:editor-config`,
    secondsCounter: `${APP_PREFIX}:seconds-counter`,
    shouldSkipHomeTransitionAnimation: `${APP_PREFIX}:should-skip-home-transition-animation`,
    shouldFormatConsoleOutput: `${APP_PREFIX}:should-format-console-output`,
    challengeLayout: `${APP_PREFIX}:challenge-layout`,
    challengeCode: `${APP_PREFIX}:challenge-code`,
  },
}
