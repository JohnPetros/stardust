import { APP_PREFIX } from './app-prefix'

export const STORAGE = {
  keys: {
    editorState: `${APP_PREFIX}:editor-state`,
    secondsCounter: `${APP_PREFIX}:seconds-counter`,
    shouldSkipHomeTransitionAnimation: `${APP_PREFIX}:should-skip-home-transition-animation`,
    shouldFormatConsoleOutput: `${APP_PREFIX}:should-format-console-output`,
    challengeLayout: `${APP_PREFIX}:challenge-layout`,
    speakerVolume: `${APP_PREFIX}:speaker-volume`,
    speakerRate: `${APP_PREFIX}:speaker-rate`,
    speakerPitch: `${APP_PREFIX}:speaker-pitch`,
    speakerEnabled: `${APP_PREFIX}:speaker-enabled`,
    challengeCode: (challengeId: string) => `${APP_PREFIX}:challenge-code.${challengeId}`,
  },
}
