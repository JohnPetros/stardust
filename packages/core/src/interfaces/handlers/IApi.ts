import type {
  IAuthService,
  IChallengingService,
  ILessonService,
  IProfileService,
  IRankingService,
  IShopService,
  ISpaceService,
  IStorageService,
} from '../services'

export interface IApi
  extends IAuthService,
    IShopService,
    IChallengingService,
    IRankingService,
    IStorageService,
    ISpaceService,
    ILessonService,
    IProfileService {}
