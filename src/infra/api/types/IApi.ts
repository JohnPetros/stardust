import type {
  IAchievementsService,
  IAuthService,
  IAvatarsService,
  IChallengesService,
  IPlanetsService,
  IRankingsService,
  IStarsService,
  IStorageService,
  IUsersService,
} from '@/@core/interfaces/services'

export interface IApi
  extends IAchievementsService,
    IAuthService,
    IAvatarsService,
    IChallengesService,
    IRankingsService,
    IStorageService,
    IPlanetsService,
    IStarsService,
    IUsersService {}
