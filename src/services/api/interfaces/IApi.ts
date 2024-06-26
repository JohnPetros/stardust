import { IAchievementsController } from './IAchievementsController'
import { IAuthController } from './IAuthController'
import { IAvatarsController } from './IAvatarsController'
import { ICategoriesController } from './ICategoriesController'
import { IChallengesController } from './IChallengesController'
import { ICommentsController } from './ICommentsController'
import { IDocsController } from './IDocsController'
import { IMdxController } from './IMdxController'
import { IPlanetsController } from './IPlanetsController'
import { IPlaygroundsController } from './IPlaygroundsController'
import { IRankingController } from './IRankingController'
import { IRocketsController } from './IRocketsController'
import { ISolutionsController } from './ISolutionsController'
import { IStarsController } from './IStarsController'
import { IStorageController } from './IStorageController'
import { IUsersController } from './IUsersController'
import { IWinnersController } from './IWinnersController'

export interface IApi
  extends IAuthController,
  IAchievementsController,
  IRankingController,
  IRocketsController,
  IPlanetsController,
  IPlaygroundsController,
  IUsersController,
  IStarsController,
  IAvatarsController,
  IChallengesController,
  IStorageController,
  ISolutionsController,
  ICategoriesController,
  ICommentsController,
  IDocsController,
  IMdxController,
  IWinnersController { }
