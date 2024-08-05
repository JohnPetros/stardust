import type {
  IAchievementsService,
  IAuthService,
  IAvatarsService,
  IChallengesService,
  IPlanetsService,
  IRankingsService,
  IRocketsSerivice,
  ISpaceService,
  ILessonService,
  IStorageService,
  IUsersService,
} from '@/@core/interfaces/services'

export interface IApi
  extends IAchievementsService,
    IAuthService,
    IAvatarsService,
    IChallengesService,
    IRocketsSerivice,
    IRankingsService,
    IStorageService,
    IPlanetsService,
    ISpaceService,
    ILessonService,
    IUsersService {}
