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
  spaceService: ReturnType<typeof SpaceService>
  storageService: ReturnType<typeof StorageService>
  lessonService: ReturnType<typeof LessonService>
  profileService: ReturnType<typeof ProfileService>
  challengingService: ReturnType<typeof ChallengingService>
  shopService: ReturnType<typeof ShopService>
  manualService: ReturnType<typeof ManualService>
}
