import { IAchievementsController } from './IAchievementsController'
import { IAuthController } from './IAuthController'
import { IAvatarsController } from './IAvatarsController'
import { ICategoriesController } from './ICategoriesController'
import { IChallengesController } from './IChallengesController'
import { ICookiesController } from './ICookiesController'
import { IMdxController } from './IMdxController'
import { IPlanetsController } from './IPlanetsController'
import { IRocketsController } from './IRocketsController'
import { IStarsController } from './IStarsController'
import { IUsersController } from './IUsersController'

export interface IApi
  extends IAuthController,
    IAchievementsController,
    IRocketsController,
    IPlanetsController,
    IUsersController,
    IStarsController,
    IAvatarsController,
    IChallengesController,
    ICategoriesController,
    ICookiesController,
    IMdxController {}
