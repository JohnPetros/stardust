import type {
  IAchievementsService,
  IAuthService,
  IAvatarsService,
  IChallengesService,
  IPlanetsService,
  IRankingsService,
  IRocketsSerivice,
  IStarsService,
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
    IStarsService,
    IUsersService {}
