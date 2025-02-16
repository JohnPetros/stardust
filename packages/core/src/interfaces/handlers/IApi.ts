import type {
  IAuthService,
  IChallengingService,
  ILessonService,
  IProfileService,
  IPlaygroundService,
  IRankingService,
  IShopService,
  ISpaceService,
  IStorageService,
  IForumService,
} from '../services'

export interface IApi
  extends IAuthService,
    IShopService,
    IChallengingService,
    IRankingService,
    IStorageService,
    IPlaygroundService,
    ISpaceService,
    ILessonService,
    IForumService,
    IProfileService {}
