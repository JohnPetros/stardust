import type {
  AuthService,
  SpaceService,
  StorageService,
  LessonService,
  ProfileService,
  ChallengingService,
  ShopService,
  ManualService,
} from '@/rest/services'

export type RestContextValue = {
  authService: ReturnType<typeof AuthService>
  profileService: ReturnType<typeof ProfileService>
  spaceService: ReturnType<typeof SpaceService>
  shopService: ReturnType<typeof ShopService>
  challengingService: ReturnType<typeof ChallengingService>
  manualService: ReturnType<typeof ManualService>
  lessonService: ReturnType<typeof LessonService>
  storageService: ReturnType<typeof StorageService>
}
