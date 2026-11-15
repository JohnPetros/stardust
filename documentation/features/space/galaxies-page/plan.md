---
title: Mapa de galáxias e troca de curso na Página de Galáxias — plan
spec: ./spec.md
spec_revision: 4
evaluation: ./evaluation.md
status: completed
updated_at: 2026-11-14
---

# Plan — Mapa de galáxias e troca de curso na Página de Galáxias

## Progress

### packages/core — space domain

| Path                                                                    | Change | RF/CA                             | Status    | Notes |
| ----------------------------------------------------------------------- | ------ | --------------------------------- | --------- | ----- |
| `packages/core/package.json`                                            | Modify | RF-03, RF-04, CA-04, CA-06        | completed | none  |
| `packages/core/src/space/domain/entities/Galaxy.ts`                     | Create | RF-02, RF-03, CA-03, CA-04        | completed | none  |
| `packages/core/src/space/domain/entities/Planet.ts`                     | Modify | RF-01, RF-07, CA-01, CA-14        | completed | none  |
| `packages/core/src/space/domain/entities/index.ts`                      | Modify | RF-03, CA-04                      | completed | none  |
| `packages/core/src/space/domain/entities/dtos/GalaxyDto.ts`             | Create | RF-05, CA-10                      | completed | none  |
| `packages/core/src/space/domain/entities/dtos/GalaxySummaryDto.ts`      | Create | RF-03, CA-04                      | completed | none  |
| `packages/core/src/space/domain/entities/dtos/CurrentGalaxyDto.ts`      | Create | RF-04, CA-06                      | completed | none  |
| `packages/core/src/space/domain/entities/dtos/PlanetDto.ts`             | Modify | RF-06, CA-13                      | completed | none  |
| `packages/core/src/space/domain/entities/dtos/index.ts`                 | Modify | RF-03, RF-04, CA-04, CA-06        | completed | none  |
| `packages/core/src/space/domain/entities/fakers/GalaxiesFaker.ts`       | Create | RF-03, CA-04                      | completed | none  |
| `packages/core/src/space/domain/entities/fakers/index.ts`               | Modify | RF-03, CA-04                      | completed | none  |
| `packages/core/src/space/domain/entities/tests/Galaxy.test.ts`          | Create | RF-02, RF-03, CA-03, CA-04        | completed | none  |
| `packages/core/src/space/domain/entities/tests/Planet.test.ts`          | Modify | RF-07, CA-14                      | completed | none  |
| `packages/core/src/space/domain/structures/GalaxyStatus.ts`             | Create | RF-03, RF-05, CA-04, CA-10        | completed | none  |
| `packages/core/src/space/domain/structures/GalaxyCatalog.ts`            | Create | RF-03, RF-04, CA-04, CA-07, CA-08 | completed | none  |
| `packages/core/src/space/domain/structures/index.ts`                    | Create | RF-03, RF-04, CA-04, CA-07, CA-08 | completed | none  |
| `packages/core/src/space/domain/structures/tests/GalaxyStatus.test.ts`  | Create | RF-03, RF-05, CA-04, CA-10        | completed | none  |
| `packages/core/src/space/domain/structures/tests/GalaxyCatalog.test.ts` | Create | RF-03, RF-04, CA-04, CA-07, CA-08 | completed | none  |
| `packages/core/src/space/domain/errors/GalaxyNotFoundError.ts`          | Create | RF-04, RF-05, CA-08, CA-10        | completed | none  |
| `packages/core/src/space/domain/errors/GalaxyNotEnterableError.ts`      | Create | RF-05, CA-10                      | completed | none  |
| `packages/core/src/space/domain/errors/index.ts`                        | Modify | RF-05, CA-10                      | completed | none  |

### packages/core — space interfaces e use cases

| Path                                                                         | Change | RF/CA                                    | Status    | Notes |
| ---------------------------------------------------------------------------- | ------ | ---------------------------------------- | --------- | ----- |
| `packages/core/src/space/interfaces/GalaxiesRepository.ts`                   | Create | RF-03, RF-04, CA-04, CA-06               | completed | none  |
| `packages/core/src/space/interfaces/SpaceService.ts`                         | Modify | RF-03, RF-04, RF-06, CA-04, CA-06, CA-13 | completed | none  |
| `packages/core/src/space/interfaces/PlanetsRepository.ts`                    | Modify | RF-07, RF-08, CA-14, CA-19               | completed | none  |
| `packages/core/src/space/interfaces/index.ts`                                | Modify | RF-03, CA-04                             | completed | none  |
| `packages/core/src/space/use-cases/ListGalaxiesUseCase.ts`                   | Create | RF-02, RF-03, CA-03, CA-04, CA-05        | completed | none  |
| `packages/core/src/space/use-cases/GetCurrentGalaxyUseCase.ts`               | Create | RF-04, CA-06, CA-07, CA-08               | completed | none  |
| `packages/core/src/space/use-cases/GetGalaxyUseCase.ts`                      | Create | RF-05, CA-10                             | completed | none  |
| `packages/core/src/space/use-cases/ListGalaxyPlanetsUseCase.ts`              | Create | RF-06, CA-13                             | completed | none  |
| `packages/core/src/space/use-cases/GetNextStarUseCase.ts`                    | Modify | RF-07, CA-14, CA-16                      | completed | none  |
| `packages/core/src/space/use-cases/UnlockFirstStarUseCase.ts`                | Modify | RF-07, CA-17                             | completed | none  |
| `packages/core/src/space/use-cases/CreatePlanetUseCase.ts`                   | Modify | RF-08, CA-19                             | completed | none  |
| `packages/core/src/space/use-cases/ReorderPlanetsUseCase.ts`                 | Modify | RF-08, CA-19                             | completed | none  |
| `packages/core/src/space/use-cases/HandleStarsNewOrderUseCase.ts`            | Modify | RF-07, CA-18                             | completed | none  |
| `packages/core/src/space/use-cases/index.ts`                                 | Modify | RF-03, RF-05, CA-04, CA-10               | completed | none  |
| `packages/core/src/space/use-cases/tests/ListGalaxiesUseCase.test.ts`        | Create | RF-02, RF-03, CA-03, CA-04, CA-05        | completed | none  |
| `packages/core/src/space/use-cases/tests/GetCurrentGalaxyUseCase.test.ts`    | Create | RF-04, CA-06, CA-07, CA-08               | completed | none  |
| `packages/core/src/space/use-cases/tests/GetGalaxyUseCase.test.ts`           | Create | RF-05, CA-10                             | completed | none  |
| `packages/core/src/space/use-cases/tests/ListGalaxyPlanetsUseCase.test.ts`   | Create | RF-06, CA-13                             | completed | none  |
| `packages/core/src/space/use-cases/tests/GetNextStarUseCase.test.ts`         | Modify | RF-07, CA-14, CA-16                      | completed | none  |
| `packages/core/src/space/use-cases/tests/UnlockFirstStarUseCase.test.ts`     | Modify | RF-07, CA-17                             | completed | none  |
| `packages/core/src/space/use-cases/tests/CreatePlanetUseCase.test.ts`        | Modify | RF-08, CA-19                             | completed | none  |
| `packages/core/src/space/use-cases/tests/ReorderPlanetsUseCase.test.ts`      | Modify | RF-08, CA-19                             | completed | none  |
| `packages/core/src/space/use-cases/tests/HandleStarsNewOrderUseCase.test.ts` | Modify | RF-07, CA-18                             | completed | none  |

### packages/core — profile e storage

| Path                                                                                          | Change | RF/CA                      | Status    | Notes |
| --------------------------------------------------------------------------------------------- | ------ | -------------------------- | --------- | ----- |
| `packages/core/src/profile/domain/aggregates/GalaxyAggregate.ts`                              | Create | RF-04, RF-05, CA-06, CA-09 | completed | none  |
| `packages/core/src/profile/domain/aggregates/index.ts`                                        | Modify | RF-04, RF-05, CA-06, CA-09 | completed | none  |
| `packages/core/src/profile/domain/aggregates/dtos/GalaxyAggregateDto.ts`                      | Create | RF-04, RF-05, CA-06, CA-09 | completed | none  |
| `packages/core/src/profile/domain/aggregates/dtos/index.ts`                                   | Modify | RF-04, RF-05, CA-06, CA-09 | completed | none  |
| `packages/core/src/profile/domain/aggregates/fakers/GalaxyAggregatesFaker.ts`                 | Create | RF-04, RF-05, CA-06, CA-09 | completed | none  |
| `packages/core/src/profile/domain/aggregates/fakers/index.ts`                                 | Modify | RF-04, RF-05, CA-06, CA-09 | completed | none  |
| `packages/core/src/profile/interfaces/ProfileService.ts`                                      | Modify | RF-05, RF-10, CA-09, CA-26 | completed | none  |
| `packages/core/src/profile/domain/entities/User.ts`                                           | Modify | RF-04, RF-05, CA-06, CA-09 | completed | none  |
| `packages/core/src/profile/domain/entities/dtos/UserDto.ts`                                   | Modify | RF-04, RF-05, CA-06, CA-09 | completed | none  |
| `packages/core/src/profile/domain/entities/tests/User.test.ts`                                | Modify | RF-04, RF-05, CA-06, CA-09 | completed | none  |
| `packages/core/src/profile/factories/UserFactory.ts`                                          | Modify | RF-04, RF-05, CA-06, CA-09 | completed | none  |
| `packages/core/src/profile/use-cases/EnterGalaxyUseCase.ts`                                   | Create | RF-04, RF-05, CA-07, CA-09 | completed | none  |
| `packages/core/src/profile/use-cases/CompleteSpaceUseCase.ts`                                 | Modify | RF-07, CA-16               | completed | none  |
| `packages/core/src/profile/use-cases/UpdateSpaceForAllUsersUseCase.ts`                        | Modify | RF-07, CA-18               | completed | none  |
| `packages/core/src/profile/use-cases/index.ts`                                                | Modify | RF-05, CA-09               | completed | none  |
| `packages/core/src/challenging/use-cases/GetChallengeCompletionAttemptsUseCase.ts`            | Create | RF-07, CA-16               | completed | none  |
| `packages/core/src/challenging/use-cases/index.ts`                                            | Modify | RF-07, CA-16               | completed | none  |
| `packages/core/src/challenging/use-cases/tests/GetChallengeCompletionAttemptsUseCase.test.ts` | Create | RF-07, CA-16               | completed | none  |
| `packages/core/src/profile/use-cases/tests/EnterGalaxyUseCase.test.ts`                        | Create | RF-04, RF-05, CA-07, CA-09 | completed | none  |
| `packages/core/src/profile/use-cases/tests/CompleteSpaceUseCase.test.ts`                      | Modify | RF-07, CA-16               | completed | none  |
| `packages/core/src/profile/use-cases/tests/UpdateSpaceForAllUsersUseCase.test.ts`             | Modify | RF-07, CA-18               | completed | none  |
| `packages/core/src/storage/types/FileStorageFolderPathValue.ts`                               | Modify | RF-13, CA-34               | completed | none  |
| `packages/core/src/storage/domain/structures/FileStorageFolderPath.ts`                        | Modify | RF-13, CA-34               | completed | none  |
| `packages/core/src/storage/domain/structures/tests/FileStorageFolderPath.test.ts`             | Create | RF-13, CA-34               | completed | none  |

### packages/validation

| Path                                                        | Change | RF/CA                      | Status    | Notes |
| ----------------------------------------------------------- | ------ | -------------------------- | --------- | ----- |
| `packages/validation/package.json`                          | Modify | RF-05, RF-06, CA-10, CA-13 | completed | none  |
| `packages/validation/src/modules/space/galaxySlugSchema.ts` | Create | RF-05, RF-06, CA-10, CA-13 | completed | none  |
| `packages/validation/src/modules/space/index.ts`            | Create | RF-05, RF-06, CA-10, CA-13 | completed | none  |
| `packages/validation/src/main.ts`                           | Modify | RF-05, RF-06, CA-10, CA-13 | completed | none  |

### apps/server — HTTP edge

| Path                                                        | Change | RF/CA                                    | Status    | Notes |
| ----------------------------------------------------------- | ------ | ---------------------------------------- | --------- | ----- |
| `apps/server/src/app/hono/HonoHttp.ts`                      | Modify | RF-04, CA-06, CA-07, CA-08               | completed | none  |
| `apps/server/src/app/hono/routers/space/GalaxiesRouter.ts`  | Create | RF-03, RF-04, RF-06, CA-04, CA-06, CA-13 | completed | none  |
| `apps/server/src/app/hono/routers/space/SpaceRouter.ts`     | Modify | RF-03, CA-04                             | completed | none  |
| `apps/server/src/app/hono/routers/space/PlanetsRouter.ts`   | Modify | RF-08, CA-19                             | completed | none  |
| `apps/server/src/app/hono/routers/profile/UsersRouter.ts`   | Modify | RF-05, RF-07, CA-09, CA-10, CA-16        | completed | none  |
| `apps/server/src/app/hono/middlewares/SpaceMiddleware.ts`   | Modify | RF-04, RF-05, RF-07, CA-06, CA-10, CA-16 | completed | none  |
| `apps/server/src/app/hono/middlewares/ProfileMiddleware.ts` | Modify | RF-03, RF-04, CA-03, CA-06               | completed | none  |
| `apps/server/rest-client/space/galaxies.rest`               | Create | RF-03, RF-04, RF-06, CA-04, CA-06, CA-13 | completed | none  |
| `apps/server/rest-client/profile/users.rest`                | Modify | RF-05, CA-09                             | completed | none  |

### apps/server — controllers

| Path                                                                                                          | Change | RF/CA                      | Status    | Notes |
| ------------------------------------------------------------------------------------------------------------- | ------ | -------------------------- | --------- | ----- |
| `apps/server/src/rest/controllers/space/index.ts`                                                             | Modify | RF-03, CA-04               | completed | none  |
| `apps/server/src/rest/controllers/space/galaxies/ListGalaxiesController.ts`                                   | Create | RF-03, CA-03, CA-04        | completed | none  |
| `apps/server/src/rest/controllers/space/galaxies/ResolveCurrentGalaxyController.ts`                           | Create | RF-04, CA-06               | completed | none  |
| `apps/server/src/rest/controllers/space/galaxies/ListGalaxyPlanetsController.ts`                              | Create | RF-06, CA-13               | completed | none  |
| `apps/server/src/rest/controllers/space/galaxies/AppendEnterableGalaxyToBodyController.ts`                    | Create | RF-05, CA-10               | completed | none  |
| `apps/server/src/rest/controllers/space/galaxies/index.ts`                                                    | Create | RF-03, RF-04, CA-04, CA-06 | completed | none  |
| `apps/server/src/rest/controllers/space/galaxies/tests/ListGalaxiesController.test.ts`                        | Create | RF-03, CA-03, CA-04        | completed | none  |
| `apps/server/src/rest/controllers/space/galaxies/tests/ResolveCurrentGalaxyController.test.ts`                | Create | RF-04, CA-06               | completed | none  |
| `apps/server/src/rest/controllers/space/galaxies/tests/ListGalaxyPlanetsController.test.ts`                   | Create | RF-06, CA-13               | completed | none  |
| `apps/server/src/rest/controllers/space/galaxies/tests/AppendEnterableGalaxyToBodyController.test.ts`         | Create | RF-05, CA-10               | completed | none  |
| `apps/server/src/rest/controllers/space/planets/FetchAllPlanetsController.ts`                                 | Modify | RF-08, CA-19               | completed | none  |
| `apps/server/src/rest/controllers/space/planets/CreatePlanetController.ts`                                    | Modify | RF-08, CA-19               | completed | none  |
| `apps/server/src/rest/controllers/space/planets/ReorderPlanetsController.ts`                                  | Modify | RF-08, CA-19               | completed | none  |
| `apps/server/src/rest/controllers/space/planets/tests/FetchAllPlanetsController.test.ts`                      | Modify | RF-08, CA-19               | completed | none  |
| `apps/server/src/rest/controllers/space/planets/tests/CreatePlanetController.test.ts`                         | Modify | RF-08, CA-19               | completed | none  |
| `apps/server/src/rest/controllers/space/planets/tests/ReorderPlanetsController.test.ts`                       | Modify | RF-08, CA-19               | completed | none  |
| `apps/server/src/rest/controllers/space/stars/AppendNextStarToBodyController.ts`                              | Modify | RF-07, CA-14, CA-16        | completed | none  |
| `apps/server/src/rest/controllers/space/stars/tests/AppendNextStarToBodyController.test.ts`                   | Modify | RF-07, CA-14, CA-16        | completed | none  |
| `apps/server/src/rest/controllers/profile/users/EnterGalaxyController.ts`                                     | Create | RF-05, CA-09               | completed | none  |
| `apps/server/src/rest/controllers/profile/users/SyncCurrentGalaxyController.ts`                               | Create | RF-04, CA-06, CA-07        | completed | none  |
| `apps/server/src/rest/controllers/profile/users/AppendUserGalaxyProgressToBodyController.ts`                  | Create | RF-02, RF-03, CA-03        | completed | none  |
| `apps/server/src/rest/controllers/profile/users/AppendUserCurrentGalaxyToBodyController.ts`                   | Create | RF-04, CA-06               | completed | none  |
| `apps/server/src/rest/controllers/profile/users/CompleteSpaceController.ts`                                   | Modify | RF-07, CA-16               | completed | none  |
| `apps/server/src/rest/controllers/profile/users/RewardUserForStarChallengeCompletionController.ts`            | Modify | RF-07, CA-16               | completed | none  |
| `apps/server/src/rest/controllers/profile/users/index.ts`                                                     | Modify | RF-05, CA-09               | completed | none  |
| `apps/server/src/rest/controllers/profile/users/tests/EnterGalaxyController.test.ts`                          | Create | RF-05, CA-09               | completed | none  |
| `apps/server/src/rest/controllers/profile/users/tests/SyncCurrentGalaxyController.test.ts`                    | Create | RF-04, CA-06, CA-07        | completed | none  |
| `apps/server/src/rest/controllers/profile/users/tests/AppendUserGalaxyProgressToBodyController.test.ts`       | Create | RF-02, RF-03, CA-03        | completed | none  |
| `apps/server/src/rest/controllers/profile/users/tests/AppendUserCurrentGalaxyToBodyController.test.ts`        | Create | RF-04, CA-06               | completed | none  |
| `apps/server/src/rest/controllers/profile/users/tests/CompleteSpaceController.test.ts`                        | Modify | RF-07, CA-16               | completed | none  |
| `apps/server/src/rest/controllers/profile/users/tests/RewardUserForStarChallengeCompletionController.test.ts` | Modify | RF-07, CA-16               | completed | none  |

### apps/server — queue

| Path                                                                    | Change | RF/CA               | Status    | Notes |
| ----------------------------------------------------------------------- | ------ | ------------------- | --------- | ----- |
| `apps/server/src/queue/jobs/space/UnlockFirstStarJob.ts`                | Modify | RF-07, CA-17        | completed | none  |
| `apps/server/src/queue/jobs/space/HandleStarsNewOrderJob.ts`            | Modify | RF-07, CA-18        | completed | none  |
| `apps/server/src/queue/jobs/space/tests/UnlockFirstStarJob.test.ts`     | Create | RF-07, CA-17        | completed | none  |
| `apps/server/src/queue/jobs/space/tests/HandleStarsNewOrderJob.test.ts` | Create | RF-07, CA-18        | completed | none  |
| `apps/server/src/queue/inngest/functions/SpaceFunctions.ts`             | Modify | RF-07, CA-17, CA-18 | completed | none  |

### apps/server — database

| Path                                                                                | Change   | RF/CA                                    | Status    | Notes |
| ----------------------------------------------------------------------------------- | -------- | ---------------------------------------- | --------- | ----- |
| `apps/server/src/database/drizzle/models/space/galaxy-model.ts`                     | Create   | RF-01, CA-01, CA-02                      | completed | none  |
| `apps/server/src/database/drizzle/models/space/planet-model.ts`                     | Modify   | RF-01, CA-01                             | completed | none  |
| `apps/server/src/database/drizzle/models/space/index.ts`                            | Modify   | RF-01, CA-01                             | completed | none  |
| `apps/server/src/database/drizzle/models/profile/user-model.ts`                     | Modify   | RF-01, RF-04, CA-01, CA-06               | completed | none  |
| `apps/server/src/database/drizzle/types/entities/space/DrizzleGalaxy.ts`            | Create   | RF-01, RF-03, CA-01, CA-04               | completed | none  |
| `apps/server/src/database/drizzle/types/entities/space/index.ts`                    | Modify   | RF-01, RF-03, CA-01, CA-04               | completed | none  |
| `apps/server/src/database/drizzle/types/entities/profile/DrizzleUser.ts`            | Modify   | RF-04, CA-06                             | completed | none  |
| `apps/server/src/database/drizzle/mappers/space/DrizzleGalaxyMapper.ts`             | Create   | RF-03, CA-04                             | completed | none  |
| `apps/server/src/database/drizzle/mappers/space/DrizzlePlanetMapper.ts`             | Modify   | RF-01, RF-06, CA-01, CA-13               | completed | none  |
| `apps/server/src/database/drizzle/mappers/space/index.ts`                           | Modify   | RF-03, CA-04                             | completed | none  |
| `apps/server/src/database/drizzle/mappers/profile/DrizzleUserMapper.ts`             | Modify   | RF-04, CA-06                             | completed | none  |
| `apps/server/src/database/drizzle/repositories/space/DrizzleGalaxiesRepository.ts`  | Create   | RF-02, RF-03, RF-04, CA-03, CA-04, CA-06 | completed | none  |
| `apps/server/src/database/drizzle/repositories/space/DrizzlePlanetsRepository.ts`   | Modify   | RF-06, RF-08, CA-13, CA-19               | completed | none  |
| `apps/server/src/database/drizzle/repositories/space/index.ts`                      | Modify   | RF-02, RF-03, RF-04, CA-03, CA-04, CA-06 | completed | none  |
| `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`   | Modify   | RF-02, RF-04, RF-07, CA-03, CA-06, CA-07 | completed | none  |
| `apps/server/src/database/drizzle/migrations/0003_galaxies.sql`                     | Generate | RF-01, CA-01, CA-02                      | completed | none  |
| `apps/server/src/database/drizzle/migrations/0004_galaxies_catalog.sql`             | Create   | RF-01, CA-01, CA-02                      | completed | none  |
| `apps/server/src/database/drizzle/migrations/0005_planets_galaxy_required.sql`      | Generate | RF-01, CA-01                             | completed | none  |
| `apps/server/src/database/drizzle/migrations/meta/0003_snapshot.json`               | Generate | RF-01, CA-01, CA-02                      | completed | none  |
| `apps/server/src/database/drizzle/migrations/meta/0004_snapshot.json`               | Generate | RF-01, CA-01, CA-02                      | completed | none  |
| `apps/server/src/database/drizzle/migrations/meta/0005_snapshot.json`               | Generate | RF-01, CA-01                             | completed | none  |
| `apps/server/src/database/drizzle/migrations/meta/_journal.json`                    | Generate | RF-01, RF-14, CA-01, CA-35               | completed | none  |
| `apps/server/src/database/supabase/repositories/space/SupabasePlanetsRepository.ts` | Modify   | RF-08, CA-19                             | completed | none  |
| `apps/server/src/database/seed.ts`                                                  | Modify   | RF-01, RF-13, CA-01, CA-34               | completed | none  |
| `apps/server/src/database/seeders/SpaceSeeder.ts`                                   | Modify   | RF-01, RF-13, CA-01, CA-34               | completed | none  |
| `apps/server/src/database/seeders/seed-data.ts`                                     | Modify   | RF-01, RF-13, CA-01, CA-34               | completed | none  |
| `apps/server/src/database/seeders/data/seed-catalog.json`                           | Modify   | RF-01, RF-10, RF-13, CA-26, CA-34        | completed | none  |
| `apps/server/src/tests/fixtures/SpaceFixture.ts`                                    | Modify   | RF-03, RF-04, RF-05, CA-04, CA-06, CA-09 | completed | none  |

### apps/server — testes de rota

| Path                                                                                           | Change | RF/CA                                    | Status    | Notes |
| ---------------------------------------------------------------------------------------------- | ------ | ---------------------------------------- | --------- | ----- |
| `apps/server/src/tests/routes/space/galaxies/ListGalaxiesRoute.test.ts`                        | Create | RF-03, CA-03, CA-04, CA-05, CA-11        | completed | none  |
| `apps/server/src/tests/routes/space/galaxies/FetchCurrentGalaxyRoute.test.ts`                  | Create | RF-04, CA-06, CA-07, CA-08, CA-11        | completed | none  |
| `apps/server/src/tests/routes/space/galaxies/ListGalaxyPlanetsRoute.test.ts`                   | Create | RF-06, CA-11, CA-13                      | completed | none  |
| `apps/server/src/tests/routes/space/planets/FetchAllPlanetsRoute.test.ts`                      | Modify | RF-08, CA-19                             | completed | none  |
| `apps/server/src/tests/routes/space/planets/CreatePlanetRoute.test.ts`                         | Modify | RF-08, CA-19                             | completed | none  |
| `apps/server/src/tests/routes/profile/users/EnterGalaxyRoute.test.ts`                          | Create | RF-05, RF-07, CA-09, CA-10, CA-11, CA-15 | completed | none  |
| `apps/server/src/tests/routes/profile/users/RewardUserForStarChallengeCompletionRoute.test.ts` | Modify | RF-07, CA-16                             | completed | none  |

### scripts

| Path                                                    | Change | RF/CA               | Status    | Notes |
| ------------------------------------------------------- | ------ | ------------------- | --------- | ----- |
| `scripts/check-drizzle-transition.mjs`                  | Modify | RF-14, CA-35, CA-36 | completed | none  |
| `apps/server/scripts/migrate-database.ts`               | Modify | RF-14, CA-35        | completed | none  |
| `scripts/tests/check-drizzle-transition.test.mjs`       | Modify | RF-14, CA-35, CA-36 | completed | none  |
| `scripts/seed-local-assets.mjs`                         | Modify | RF-13, CA-34        | completed | none  |
| `scripts/tests/galaxies-migration.integration.test.mjs` | Create | RF-01, CA-01, CA-02 | completed | none  |

### apps/web — rotas e services

| Path                                                             | Change | RF/CA                                                                       | Status    | Notes |
| ---------------------------------------------------------------- | ------ | --------------------------------------------------------------------------- | --------- | ----- |
| `apps/web/src/app/(home)/space/page.tsx`                         | Modify | RF-06, CA-12                                                                | completed | none  |
| `apps/web/src/app/(home)/space/tests/page.test.tsx`              | Create | RF-06, CA-12                                                                | completed | none  |
| `apps/web/src/app/(home)/space/[galaxySlug]/page.tsx`            | Create | RF-06, CA-12, CA-13                                                         | completed | none  |
| `apps/web/src/app/(home)/space/[galaxySlug]/tests/page.test.tsx` | Create | RF-06, CA-12, CA-13                                                         | completed | none  |
| `apps/web/src/app/(home)/space/galaxies/page.tsx`                | Create | RF-09, CA-25                                                                | completed | none  |
| `apps/web/src/app/(home)/space/galaxies/tests/page.test.tsx`     | Create | RF-09, CA-25                                                                | completed | none  |
| `apps/web/src/app/tests/space/galaxies.test.ts`                  | Create | RF-06, RF-09, RF-10, RF-11, RF-12, CA-12, CA-13, CA-20, CA-26, CA-29, CA-31 | completed | none  |
| `apps/web/src/app/tests/space/space.test.ts`                     | Modify | RF-06, RF-07, CA-13, CA-15                                                  | completed | none  |
| `apps/web/src/constants/routes.ts`                               | Modify | RF-06, RF-09, CA-12, CA-25                                                  | completed | none  |
| `apps/web/src/rest/services/SpaceService.ts`                     | Modify | RF-06, RF-09, CA-13, CA-20                                                  | completed | none  |
| `apps/web/src/rest/services/ProfileService.ts`                   | Modify | RF-10, CA-26                                                                | completed | none  |
| `apps/backoffice/src/rest/services/SpaceService.ts`              | Modify | RF-03, CA-04                                                                | completed | none  |
| `apps/backoffice/src/rest/services/ProfileService.ts`            | Modify | RF-05, CA-09                                                                | completed | none  |

### apps/web — UI

| Path                                                                                                   | Change | RF/CA                                                  | Status    | Notes |
| ------------------------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------ | --------- | ----- |
| `apps/web/src/ui/global/widgets/components/Animation/types/AnimationProps.ts`                          | Modify | RF-09, RF-12, RF-13, CA-21, CA-33, CA-34               | completed | none  |
| `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/index.tsx`                        | Modify | RF-09, RF-12, RF-13, CA-21, CA-33, CA-34               | completed | none  |
| `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/useLottieAnimation.ts`            | Modify | RF-09, RF-12, RF-13, CA-21, CA-33, CA-34               | completed | none  |
| `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/LottieAnimationView.tsx`          | Modify | RF-09, RF-12, RF-13, CA-21, CA-33, CA-34               | completed | none  |
| `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/tests/useLottieAnimation.test.ts` | Create | RF-09, RF-12, RF-13, CA-21, CA-33, CA-34               | completed | none  |
| `apps/web/src/ui/space/hooks/useGalaxiesQuery.ts`                                                      | Create | RF-09, CA-20, CA-22, CA-23                             | completed | none  |
| `apps/web/src/ui/space/hooks/useEnterGalaxyAction.ts`                                                  | Create | RF-10, CA-26, CA-27                                    | completed | none  |
| `apps/web/src/ui/space/contexts/SpaceContext/index.tsx`                                                | Modify | RF-06, RF-07, CA-13, CA-15                             | completed | none  |
| `apps/web/src/ui/space/contexts/SpaceContext/useSpaceContextProvider.ts`                               | Modify | RF-06, RF-07, CA-13, CA-15                             | completed | none  |
| `apps/web/src/ui/space/contexts/SpaceContext/types/SpaceContextValue.ts`                               | Modify | RF-06, RF-07, CA-13, CA-15                             | completed | none  |
| `apps/web/src/ui/space/contexts/SpaceContext/tests/useSpaceContextProvider.test.ts`                    | Modify | RF-06, RF-07, CA-13, CA-15                             | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Space/index.tsx`                                                  | Modify | RF-07, RF-11, CA-29, CA-30                             | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Space/useSpacePage.ts`                                            | Modify | RF-07, RF-11, CA-29, CA-30                             | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Space/tests/useSpacePage.test.ts`                                 | Create | RF-07, RF-11, CA-29, CA-30                             | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Space/SpacePageView.tsx`                                          | Create | RF-07, RF-11, CA-29, CA-30                             | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Space/tests/SpacePageView.test.tsx`                               | Create | RF-07, RF-11, CA-29, CA-30                             | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Space/GalaxyControl/index.tsx`                                    | Create | RF-11, RF-12, CA-29, CA-30, CA-32                      | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Space/GalaxyControl/GalaxyControlView.tsx`                        | Create | RF-11, RF-12, CA-29, CA-30, CA-32                      | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Space/GalaxyControl/tests/GalaxyControlView.test.tsx`             | Create | RF-11, RF-12, CA-29, CA-30, CA-32                      | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/index.tsx`                                      | Modify | RF-07, CA-15                                           | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/index.tsx`                                               | Create | RF-09, RF-10, CA-20, CA-26                             | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/GalaxiesPageView.tsx`                                    | Create | RF-09, CA-20, CA-22, CA-23, CA-24                      | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/useGalaxiesPage.ts`                                      | Create | RF-09, RF-10, CA-24, CA-26, CA-27, CA-28               | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/tests/useGalaxiesPage.test.ts`                           | Create | RF-09, RF-10, CA-24, CA-26, CA-27, CA-28               | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/tests/GalaxiesPageView.test.tsx`                         | Create | RF-09, CA-20, CA-22, CA-23, CA-24                      | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/GalaxiesMap/index.tsx`                                   | Create | RF-09, RF-12, CA-20, CA-31                             | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/GalaxiesMap/GalaxiesMapView.tsx`                         | Create | RF-09, RF-12, CA-20, CA-31                             | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/GalaxyItem/index.tsx`                                    | Create | RF-09, RF-12, CA-20, CA-33                             | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/GalaxyItem/GalaxyItemView.tsx`                           | Create | RF-09, RF-10, RF-12, CA-20, CA-21, CA-26, CA-32, CA-33 | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/GalaxyItem/tests/GalaxyItemView.test.tsx`                | Create | RF-09, RF-10, RF-12, CA-20, CA-21, CA-26, CA-32, CA-33 | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/GalaxiesLoading/index.tsx`                               | Create | RF-09, CA-22                                           | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/GalaxiesLoading/GalaxiesLoadingView.tsx`                 | Create | RF-09, CA-22                                           | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/GalaxiesLoadFailure/index.tsx`                           | Create | RF-09, CA-23                                           | completed | none  |
| `apps/web/src/ui/space/widgets/pages/Galaxies/GalaxiesLoadFailure/GalaxiesLoadFailureView.tsx`         | Create | RF-09, CA-23                                           | completed | none  |

### packages/studio

| Path                                                                         | Change | RF/CA        | Status    | Notes |
| ---------------------------------------------------------------------------- | ------ | ------------ | --------- | ----- |
| `packages/studio/public/projects/galaxies/logica-de-programacao/lottie.json` | Create | RF-13, CA-34 | completed | none  |
| `packages/studio/public/projects/galaxies/orientacao-a-objetos/lottie.json`  | Create | RF-13, CA-34 | completed | none  |
| `packages/studio/public/projects/galaxies/galaxia-de-teste/lottie.json`      | Create | RF-13, CA-34 | completed | none  |

### documentation

| Path                                        | Change | RF/CA                             | Status    | Notes |
| ------------------------------------------- | ------ | --------------------------------- | --------- | ----- |
| `documentation/rules/ui-layer-rules.md`     | Modify | RF-09, RF-10, CA-20, CA-26        | completed | none  |
| `documentation/rules/widget-tests-rules.md` | Modify | RF-09, RF-10, CA-20, CA-26        | completed | none  |
| `documentation/tooling.md`                  | Modify | RF-13, RF-14, CA-34, CA-35        | completed | none  |
| `documentation/infrastructure.md`           | Modify | RF-13, RF-14, CA-34, CA-35        | completed | none  |
| `documentation/architecture.md`             | Modify | RF-03, RF-06, RF-09, CA-12, CA-20 | completed | none  |

## Criteria without a contracted path

- None
