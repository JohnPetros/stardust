import type {
  AuthService,
  ProfileService,
  SpaceService,
  ShopService,
  ChallengingService,
  ForumService,
  PlaygroundService,
  ManualService,
  LessonService,
  NotificationService,
  ConversationService,
  ReportingService,
  StorageService,
} from '@/rest/services'

export type RestContextValue = {
  authService: ReturnType<typeof AuthService>
  profileService: ReturnType<typeof ProfileService>
  spaceService: ReturnType<typeof SpaceService>
  shopService: ReturnType<typeof ShopService>
  challengingService: ReturnType<typeof ChallengingService>
  forumService: ReturnType<typeof ForumService>
  playgroundService: ReturnType<typeof PlaygroundService>
  manualService: ReturnType<typeof ManualService>
  lessonService: ReturnType<typeof LessonService>
  conversationService: ReturnType<typeof ConversationService>
  reportingService: ReturnType<typeof ReportingService>
  storageService: ReturnType<typeof StorageService>
  notificationService: ReturnType<typeof NotificationService>
}
