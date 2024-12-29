import type {
  IAuthService,
  IChallengingService,
  ILessonService,
  IProfileService,
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
    ISpaceService,
    ILessonService,
    IForumService,
    IProfileService {}
