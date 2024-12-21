import type {
  IAuthService,
  IChallengingService,
  ILessonService,
  IProfileService,
  IRankingsService,
  IShopService,
  ISpaceService,
  IStorageService,
} from '../services'

export interface IApi
  extends IAuthService,
    IShopService,
    IChallengingService,
    IRankingsService,
    IStorageService,
    ISpaceService,
    ILessonService,
    IProfileService {}
