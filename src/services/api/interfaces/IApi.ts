import { IAchievementsController } from './IAchievementsController'
import { IAuthController } from './IAuthController'
import { IAvatarsController } from './IAvatarsController'
import { ICategoriesController } from './ICategoriesController'
import { ICdnController } from './ICdnController'
import { IChallengesController } from './IChallengesController'
import { ICommentsController } from './ICommentsController'
import { IDocsController } from './IDocsController'
import { IMdxController } from './IMdxController'
import { IPlanetsController } from './IPlanetsController'
import { IRankingController } from './IRankingController'
import { IRocketsController } from './IRocketsController'
import { IStarsController } from './IStarsController'
import { IUsersController } from './IUsersController'

export interface IApi
  extends IAuthController,
    IAchievementsController,
    IRankingController,
    IRocketsController,
    IPlanetsController,
    IUsersController,
    IStarsController,
    IAvatarsController,
    IChallengesController,
    ICdnController,
    ICategoriesController,
    ICommentsController,
    IDocsController,
    IMdxController {}
