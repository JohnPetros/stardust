---
title: Trilha da galáxia com progresso por fatos, abertura de planetas e staging automatizado — plan
spec: ./spec.md
spec_revision: 10
evaluation: ./evaluation.md
status: in_progress
updated_at: 2026-11-19
---

# Plan — Trilha da galáxia com progresso por fatos, abertura de planetas e staging automatizado

## Progress

### packages/core — global

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `packages/core/src/global/libs/validation/zod/ZodStringValidation.ts` | Modify | RF-01, CA-01 | completed | none |
| `packages/core/src/global/domain/structures/tests/Image.test.ts` | Modify | RF-01, CA-01 | completed | none |
| `packages/core/src/global/domain/errors/ForbiddenError.ts` | Create | RF-04, RF-05, CA-11, CA-14 | completed | none |
| `packages/core/src/global/domain/errors/index.ts` | Modify | RF-04, RF-05, CA-11, CA-14 | completed | none |

### packages/core — space (domínio)

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `packages/core/src/space/domain/structures/GalaxyTrail.ts` | Create | RF-03, CA-05, CA-06, CA-07, CA-08 | completed | none |
| `packages/core/src/space/domain/structures/StarProgressState.ts` | Create | RF-03, CA-05, CA-06, CA-07 | completed | none |
| `packages/core/src/space/domain/structures/PlanetProgressState.ts` | Create | RF-03, CA-05, CA-06, CA-07 | completed | none |
| `packages/core/src/space/domain/structures/index.ts` | Modify | RF-03, CA-05 | completed | none |
| `packages/core/src/space/domain/structures/tests/GalaxyTrail.test.ts` | Create | RF-03, CA-05, CA-06, CA-07, CA-08 | completed | none |
| `packages/core/src/space/domain/structures/tests/StarProgressState.test.ts` | Create | RF-03, CA-05, CA-06, CA-07 | completed | none |
| `packages/core/src/space/domain/structures/tests/PlanetProgressState.test.ts` | Create | RF-03, CA-05, CA-06, CA-07 | completed | none |
| `packages/core/src/space/domain/errors/StarLockedError.ts` | Create | RF-05, CA-14, CA-18 | completed | none |
| `packages/core/src/space/domain/errors/PlanetLockedError.ts` | Create | RF-04, CA-11 | completed | none |
| `packages/core/src/space/domain/errors/index.ts` | Modify | RF-04, RF-05, CA-11, CA-14 | completed | none |
| `packages/core/src/space/domain/entities/Star.ts` | Modify | RF-01, CA-25 | completed | none |
| `packages/core/src/space/domain/entities/dtos/StarDto.ts` | Modify | RF-01, CA-25 | completed | none |
| `packages/core/src/space/domain/entities/Planet.ts` | Modify | RF-01, RF-08, CA-22 | completed | none |
| `packages/core/src/space/domain/entities/dtos/PlanetDto.ts` | Modify | RF-01, RF-08, CA-22 | completed | none |
| `packages/core/src/space/domain/entities/fakers/StarsFaker.ts` | Modify | RF-01, CA-25 | completed | none |
| `packages/core/src/space/domain/entities/fakers/PlanetsFaker.ts` | Modify | RF-01, RF-08, CA-22 | completed | none |
| `packages/core/src/space/domain/entities/tests/Star.test.ts` | Modify | RF-01, CA-25 | completed | none |
| `packages/core/src/space/domain/entities/tests/Planet.test.ts` | Modify | RF-01, RF-08, CA-22 | completed | none |
| `packages/core/src/space/domain/events/SpaceOrderChangedEvent.ts` | Remove | RF-02, RF-08 | completed | none |
| `packages/core/src/space/domain/events/index.ts` | Modify | RF-02, RF-08 | completed | none |

### packages/core — space (casos de uso)

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `packages/core/src/space/use-cases/GetPlanetOpeningUseCase.ts` | Create | RF-04, CA-09, CA-10, CA-11 | completed | none |
| `packages/core/src/space/use-cases/GetStarCompletionUseCase.ts` | Create | RF-05, CA-14, CA-15, CA-16, CA-17 | completed | none |
| `packages/core/src/space/use-cases/HandleStarsNewOrderUseCase.ts` | Remove | RF-02, RF-08 | completed | none |
| `packages/core/src/space/use-cases/tests/HandleStarsNewOrderUseCase.test.ts` | Remove | RF-02, RF-08 | completed | none |
| `packages/core/src/space/use-cases/GetNextStarUseCase.ts` | Remove | RF-05, CA-15 | completed | none |
| `packages/core/src/space/use-cases/index.ts` | Modify | RF-04, RF-05 | completed | none |
| `packages/core/src/space/use-cases/tests/GetPlanetOpeningUseCase.test.ts` | Create | RF-04, CA-09, CA-10, CA-11 | completed | none |
| `packages/core/src/space/use-cases/tests/GetStarCompletionUseCase.test.ts` | Create | RF-05, CA-14, CA-15, CA-16, CA-17 | completed | none |
| `packages/core/src/space/use-cases/tests/GetNextStarUseCase.test.ts` | Remove | RF-05, CA-15 | completed | none |
| `packages/core/src/space/use-cases/CreatePlanetUseCase.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `packages/core/src/space/use-cases/UpdatePlanetUseCase.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `packages/core/src/space/use-cases/tests/CreatePlanetUseCase.test.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `packages/core/src/space/use-cases/tests/UpdatePlanetUseCase.test.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `packages/core/src/space/interfaces/SpaceService.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |

### packages/core — profile

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `packages/core/src/profile/domain/entities/User.ts` | Modify | RF-02, RF-03, CA-09, CA-15 | completed | none |
| `packages/core/src/profile/domain/entities/dtos/UserDto.ts` | Modify | RF-02, RF-03, CA-09, CA-15 | completed | none |
| `packages/core/src/profile/domain/entities/fakers/UsersFaker.ts` | Modify | RF-02, RF-03, CA-09, CA-15 | completed | none |
| `packages/core/src/profile/domain/entities/tests/User.test.ts` | Modify | RF-02, RF-03, CA-09, CA-15 | completed | none |
| `packages/core/src/profile/factories/UserFactory.ts` | Modify | RF-02, CA-09 | completed | none |
| `packages/core/src/profile/interfaces/UsersRepository.ts` | Modify | RF-02, RF-04, RF-05, RF-07, CA-09, CA-15, CA-21 | completed | none |
| `packages/core/src/profile/interfaces/ProfileService.ts` | Modify | RF-04, CA-09 | completed | none |
| `packages/core/src/profile/use-cases/CompleteStarUseCase.ts` | Create | RF-05, CA-15, CA-16 | completed | none |
| `packages/core/src/profile/use-cases/OpenPlanetUseCase.ts` | Create | RF-04, CA-09, CA-10 | completed | none |
| `packages/core/src/profile/use-cases/UnlockStarUseCase.ts` | Remove | RF-06, CA-19, CA-20 | completed | none |
| `packages/core/src/profile/use-cases/RemoveRecentlyUnlockedStarUseCase.ts` | Remove | RF-02, RF-08 | completed | none |
| `packages/core/src/profile/use-cases/UpdateSpaceForAllUsersUseCase.ts` | Remove | RF-02, RF-08 | completed | none |
| `packages/core/src/profile/use-cases/CalculateRewardForStarCompletionUseCase.ts` | Modify | RF-05, CA-15 | completed | none |
| `packages/core/src/profile/use-cases/CompleteSpaceUseCase.ts` | Modify | RF-05, CA-17 | completed | none |
| `packages/core/src/profile/use-cases/GetUnlockedStarsKpiUseCase.ts` | Modify | RF-07, CA-21 | completed | none |
| `packages/core/src/profile/use-cases/index.ts` | Modify | RF-04, RF-05 | completed | none |
| `packages/core/src/profile/use-cases/tests/CompleteStarUseCase.test.ts` | Create | RF-05, CA-15, CA-16 | completed | none |
| `packages/core/src/profile/use-cases/tests/OpenPlanetUseCase.test.ts` | Create | RF-04, CA-09, CA-10 | completed | none |
| `packages/core/src/profile/use-cases/tests/UnlockStarUse.test.ts` | Remove | RF-06, CA-19, CA-20 | completed | none |
| `packages/core/src/profile/use-cases/tests/RemoveRecentlyUnlockedStarUseCase.test.ts` | Remove | RF-02, RF-08 | completed | none |
| `packages/core/src/profile/use-cases/tests/UpdateSpaceForAllUsersUseCase.test.ts` | Remove | RF-02, RF-08 | completed | none |
| `packages/core/src/profile/use-cases/tests/CalculateRewardForStarCompletionUseCase.test.ts` | Modify | RF-05, CA-15 | completed | none |
| `packages/core/src/profile/use-cases/tests/CompleteSpaceUseCase.test.ts` | Modify | RF-05, CA-17 | completed | none |
| `packages/core/src/profile/use-cases/tests/GetUnlockedStarsKpiUseCase.test.ts` | Modify | RF-07, CA-21 | completed | none |
| `packages/core/src/profile/use-cases/ObserveNewUnlockedAchievementsUseCase.ts` | Modify | RF-07, CA-21 | completed | none |
| `packages/core/src/profile/use-cases/tests/ObserveNewUnlockedAchievementsUseCase.test.ts` | Modify | RF-07, CA-21 | completed | none |
| `packages/core/src/profile/use-cases/tests/EnterGalaxyUseCase.test.ts` | Modify | RF-02, CA-02 | completed | none |
| `packages/core/src/profile/domain/events/StarUnlockedEvent.ts` | Remove | RF-06, CA-20 | completed | none |
| `packages/core/src/profile/domain/events/index.ts` | Modify | RF-06, CA-20 | completed | none |

### apps/server — database

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/server/src/database/drizzle/models/profile/user-completed-star-model.ts` | Create | RF-02, CA-02, CA-03 | completed | none |
| `apps/server/src/database/drizzle/models/profile/user-opened-planet-model.ts` | Create | RF-02, CA-02, CA-03 | completed | none |
| `apps/server/src/database/drizzle/models/profile/user-unlocked-star-model.ts` | Remove | RF-02, CA-02 | completed | none |
| `apps/server/src/database/drizzle/models/profile/user-recently-unlocked-star-model.ts` | Remove | RF-02, CA-02 | completed | none |
| `apps/server/src/database/drizzle/models/profile/index.ts` | Modify | RF-02, CA-02 | completed | none |
| `apps/server/src/database/drizzle/models/space/star-model.ts` | Modify | RF-01, CA-01 | completed | none |
| `apps/server/src/database/drizzle/models/space/planet-model.ts` | Modify | RF-01, CA-01 | completed | none |
| `apps/server/src/database/drizzle/types/entities/profile/DrizzleUser.ts` | Modify | RF-02, CA-02 | completed | none |
| `apps/server/src/database/drizzle/mappers/profile/DrizzleUserMapper.ts` | Modify | RF-02, CA-09, CA-15 | completed | none |
| `apps/server/src/database/drizzle/mappers/space/DrizzleStarMapper.ts` | Modify | RF-01, CA-01 | completed | none |
| `apps/server/src/database/drizzle/mappers/space/DrizzlePlanetMapper.ts` | Modify | RF-01, CA-01 | completed | none |
| `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts` | Modify | RF-02, RF-04, RF-05, RF-07, CA-09, CA-15, CA-21 | completed | none |
| `apps/server/src/database/drizzle/migrations/0006_trail_progress_facts.sql` | Generate | RF-01, RF-02, CA-01, CA-02, CA-03 | completed | none |
| `apps/server/src/database/drizzle/migrations/0007_galaxy_trail_catalog.sql` | Create | RF-01, RF-02, CA-01, CA-02, CA-03, CA-04 | completed | none |
| `apps/server/src/database/drizzle/migrations/0008_drop_unlocked_stars.sql` | Generate | RF-02, CA-02 | completed | none |
| `apps/server/src/database/drizzle/migrations/meta/0006_snapshot.json` | Generate | RF-01, RF-02, CA-01, CA-02, CA-03 | completed | none |
| `apps/server/src/database/drizzle/migrations/meta/0007_snapshot.json` | Generate | RF-01, RF-02, CA-01, CA-02, CA-03, CA-04 | completed | none |
| `apps/server/src/database/drizzle/migrations/meta/0008_snapshot.json` | Generate | RF-02, CA-02 | completed | none |
| `apps/server/src/database/drizzle/migrations/meta/_journal.json` | Generate | RF-01, RF-02, CA-01, CA-02 | completed | none |
| `apps/server/src/database/supabase/repositories/profile/SupabaseUsersRepository.ts` | Modify | RF-02, CA-20 | completed | none |
| `apps/server/src/database/supabase/mappers/profile/SupabaseUserMapper.ts` | Modify | RF-02, CA-20 | completed | none |
| `apps/server/src/database/drizzle/migrations/0009_drop_planet_icon.sql` | Generate | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/database/drizzle/migrations/meta/0009_snapshot.json` | Generate | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/database/supabase/mappers/space/SupabasePlanetMapper.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/database/supabase/repositories/space/SupabasePlanetsRepository.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |

### apps/server — seed

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/server/src/database/seed.ts` | Modify | RF-16, CA-40 | completed | none |
| `apps/server/src/database/seeders/seed-config.ts` | Modify | RF-16, CA-40 | completed | none |
| `apps/server/src/database/seeders/seed-data.ts` | Modify | RF-02, CA-04 | completed | none |
| `apps/server/src/database/seeders/ProfileSeeder.ts` | Modify | RF-02, CA-04 | completed | none |
| `apps/server/src/database/seeders/data/seed-catalog.json` | Modify | RF-01, CA-04 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-aurora-image.webp` | Create | RF-01, RF-19, CA-04, CA-44 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-trivia-image.webp` | Create | RF-01, RF-19, CA-04, CA-44 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-kalkulon-image.webp` | Create | RF-01, RF-19, CA-04, CA-44 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-ifthenia-image.webp` | Create | RF-01, RF-19, CA-04, CA-44 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-ciclade-image.webp` | Create | RF-01, RF-19, CA-04, CA-44 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-o-comboio-parte-1-image.webp` | Create | RF-01, RF-19, CA-04, CA-44 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-o-comboio-parte-2-image.webp` | Create | RF-01, RF-19, CA-04, CA-44 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-arcana-image.webp` | Create | RF-01, RF-19, CA-04, CA-44 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-perene-image.webp` | Create | RF-01, RF-19, CA-04, CA-44 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-chavalor-image.webp` | Create | RF-01, RF-19, CA-04, CA-44 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-2ee862da-4b73-4fb3-984a-d6ed1743102b-image.svg` | Remove | RF-01, CA-04 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-4334d4ed-7b36-4e17-a917-7839f09f670e-image.svg` | Remove | RF-01, CA-04 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-6a4aca25-b962-4cad-9aa4-81e0a2b6c0ee-image.svg` | Remove | RF-01, CA-04 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-800775c1-b4f7-4dc7-8010-142f8dfb7ac9-image.svg` | Remove | RF-01, CA-04 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-83500701-a9b7-4f5b-8a63-599a08406f73-image.svg` | Remove | RF-01, CA-04 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-8c3b6cab-d3c6-4d64-8701-c580d4a6d31a-image.svg` | Remove | RF-01, CA-04 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-af70e6c2-49b3-4bdf-a548-6512b0f5dc94-image.svg` | Remove | RF-01, CA-04 | completed | none |
| `apps/server/package.json` | Modify | RF-15, RF-16, CA-38, CA-40 | completed | none |
| `apps/server/src/database/seeders/assets/images/planets/planet-2ee862da-4b73-4fb3-984a-d6ed1743102b-icon.svg` | Remove | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/database/seeders/assets/images/planets/planet-4334d4ed-7b36-4e17-a917-7839f09f670e-image.svg-icon.svg` | Remove | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/database/seeders/assets/images/planets/planet-6a4aca25-b962-4cad-9aa4-81e0a2b6c0ee-icon.svg` | Remove | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/database/seeders/assets/images/planets/planet-800775c1-b4f7-4dc7-8010-142f8dfb7ac9-icon.svg` | Remove | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/database/seeders/assets/images/planets/planet-83500701-a9b7-4f5b-8a63-599a08406f73-icon.svg` | Remove | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/database/seeders/assets/images/planets/planet-8c3b6cab-d3c6-4d64-8701-c580d4a6d31a-icon.svg` | Remove | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/database/seeders/assets/images/planets/planet-af70e6c2-49b3-4bdf-a548-6512b0f5dc94-icon.svg` | Remove | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/database/seeders/assets/images/planets/planet-eb67c91b-d17e-41d8-ac10-b9bdd7fbf299-icon.svg` | Remove | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/database/seeders/assets/images/planets/planet-f0fa99e3-d5fb-4ff0-8c29-a3fc7cff21e8.icon.svg` | Remove | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |

### apps/server — borda HTTP

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/server/src/app/hono/middlewares/ProfileMiddleware.ts` | Modify | RF-04, RF-05, CA-09, CA-12, CA-14, CA-43 | completed | none |
| `apps/server/src/app/hono/middlewares/SpaceMiddleware.ts` | Modify | RF-04, RF-05, CA-09, CA-12, CA-14, CA-43 | completed | none |
| `apps/server/src/app/hono/routers/profile/UsersRouter.ts` | Modify | RF-04, RF-05, CA-09, CA-12, CA-14, CA-43 | completed | none |
| `apps/server/rest-client/profile/users.rest` | Modify | RF-04, CA-09 | completed | none |
| `apps/server/src/app/hono/routers/space/PlanetsRouter.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/rest-client/space/planets.rest` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |

### apps/server — controllers

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/server/src/rest/controllers/profile/users/AppendUserTrailFactsToBodyController.ts` | Create | RF-04, RF-05, CA-09, CA-15 | completed | none |
| `apps/server/src/rest/controllers/profile/users/OpenPlanetController.ts` | Create | RF-04, CA-09, CA-10 | completed | none |
| `apps/server/src/rest/controllers/profile/users/RewardUserForStarCompletionController.ts` | Modify | RF-05, CA-15, CA-18 | completed | none |
| `apps/server/src/rest/controllers/profile/users/RewardUserForStarChallengeCompletionController.ts` | Modify | RF-05, CA-15, CA-18 | completed | none |
| `apps/server/src/rest/controllers/profile/users/index.ts` | Modify | RF-04, RF-05 | completed | none |
| `apps/server/src/rest/controllers/profile/users/tests/AppendUserTrailFactsToBodyController.test.ts` | Create | RF-04, RF-05, CA-09, CA-15 | completed | none |
| `apps/server/src/rest/controllers/profile/users/tests/OpenPlanetController.test.ts` | Create | RF-04, CA-09, CA-10 | completed | none |
| `apps/server/src/rest/controllers/profile/users/CompleteSpaceController.ts` | Modify | RF-05, CA-17 | completed | none |
| `apps/server/src/rest/controllers/profile/users/tests/CompleteSpaceController.test.ts` | Modify | RF-05, CA-17 | completed | none |
| `apps/server/src/rest/controllers/profile/users/tests/RewardUserForStarCompletionController.test.ts` | Modify | RF-05, CA-15, CA-18 | completed | none |
| `apps/server/src/rest/controllers/profile/users/tests/RewardUserForStarChallengeCompletionController.test.ts` | Modify | RF-05, CA-15, CA-18 | completed | none |
| `apps/server/src/rest/controllers/space/planets/AppendOpenablePlanetToBodyController.ts` | Create | RF-04, CA-09, CA-11 | completed | none |
| `apps/server/src/rest/controllers/space/planets/index.ts` | Modify | RF-04, CA-09, CA-11 | completed | none |
| `apps/server/src/rest/controllers/space/planets/tests/AppendOpenablePlanetToBodyController.test.ts` | Create | RF-04, CA-09, CA-11 | completed | none |
| `apps/server/src/rest/controllers/space/stars/AppendStarCompletionToBodyController.ts` | Create | RF-05, CA-14, CA-15 | completed | none |
| `apps/server/src/rest/controllers/space/stars/AppendNextStarToBodyController.ts` | Remove | RF-05, CA-14, CA-15 | completed | none |
| `apps/server/src/rest/controllers/space/stars/index.ts` | Modify | RF-05, CA-14, CA-15 | completed | none |
| `apps/server/src/rest/controllers/space/stars/tests/AppendStarCompletionToBodyController.test.ts` | Create | RF-05, CA-14, CA-15 | completed | none |
| `apps/server/src/rest/controllers/space/stars/tests/AppendNextStarToBodyController.test.ts` | Remove | RF-05, CA-14, CA-15 | completed | none |
| `apps/server/src/rest/controllers/space/planets/CreatePlanetController.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/rest/controllers/space/planets/UpdatePlanetController.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/rest/controllers/space/planets/tests/CreatePlanetController.test.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/rest/controllers/space/planets/tests/UpdatePlanetController.test.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |

### apps/server — app

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/server/src/app/hono/HonoApp.ts` | Modify | RF-04, RF-05, CA-11, CA-14 | completed | none |
| `apps/server/src/app/hono/HonoHttp.ts` | Modify | RF-04, CA-09 | completed | none |

### apps/server — queue e provision

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/server/src/queue/jobs/profile/CreateUserJob.ts` | Modify | RF-06, CA-19 | completed | none |
| `apps/server/src/queue/jobs/profile/tests/CreateUserJob.test.ts` | Create | RF-06, CA-19 | completed | none |
| `apps/server/src/queue/jobs/space/HandleStarsNewOrderJob.ts` | Remove | RF-02, RF-08 | completed | none |
| `apps/server/src/queue/jobs/space/tests/HandleStarsNewOrderJob.test.ts` | Remove | RF-02, RF-08 | completed | none |
| `apps/server/src/queue/jobs/space/index.ts` | Modify | RF-02, RF-08 | completed | none |
| `apps/server/src/queue/inngest/functions/SpaceFunctions.ts` | Modify | RF-02, RF-08 | completed | none |
| `apps/server/src/queue/jobs/profile/UpdateSpaceForAllUsersJob.ts` | Remove | RF-02, RF-08 | completed | none |
| `apps/server/src/queue/jobs/profile/index.ts` | Modify | RF-02, RF-08 | completed | none |
| `apps/server/src/queue/inngest/functions/tests/InngestFunctionsAssembly.test.ts` | Modify | RF-06, CA-20 | completed | none |
| `apps/server/src/queue/inngest/functions/AnalyticsFunctions.ts` | Modify | RF-06, CA-20 | completed | none |
| `apps/server/src/provision/xlsx/ExcelJsXlsxProvider.ts` | Modify | RF-07, CA-21 | completed | none |
| `apps/server/src/provision/xlsx/tests/ExcelJsXlsxProvider.test.ts` | Remove | RF-07, CA-21 | completed | none |

### apps/server — testes de rota

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/server/src/tests/routes/profile/users/OpenPlanetRoute.test.ts` | Create | RF-04, CA-09, CA-10, CA-11, CA-12, CA-13 | completed | none |
| `apps/server/src/tests/routes/profile/users/RewardUserForStarCompletionRoute.test.ts` | Modify | RF-05, CA-14, CA-15, CA-16, CA-17, CA-43 | completed | none |
| `apps/server/src/tests/routes/profile/users/RewardUserForStarChallengeCompletionRoute.test.ts` | Modify | RF-05, CA-14, CA-15, CA-18 | completed | none |
| `apps/server/src/tests/routes/profile/users/FetchUnlockedStarsKpiRoute.test.ts` | Modify | RF-07, CA-21 | completed | none |
| `apps/server/src/tests/routes/profile/users/FetchUserByIdRoute.test.ts` | Modify | RF-02, CA-09 | completed | none |
| `apps/server/src/tests/routes/space/galaxies/ListGalaxyPlanetsRoute.test.ts` | Modify | RF-01, CA-22 | completed | none |
| `apps/server/src/tests/routes/space/galaxies/ListGalaxiesRoute.test.ts` | Modify | RF-08, CA-22 | completed | none |
| `apps/server/src/tests/routes/space/galaxies/FetchCurrentGalaxyRoute.test.ts` | Modify | RF-02, CA-02 | completed | none |
| `apps/server/src/tests/routes/profile/users/EnterGalaxyRoute.test.ts` | Modify | RF-02, CA-02 | completed | none |
| `apps/server/src/tests/routes/profile/users/GenerateUsersXlsxFileRoute.test.ts` | Modify | RF-07, CA-21 | completed | none |
| `apps/server/src/tests/fixtures/SpaceFixture.ts` | Modify | RF-02, RF-04, RF-05, CA-09, CA-15 | completed | none |
| `apps/server/src/tests/fixtures/ProfileFixture.ts` | Modify | RF-02, RF-04, RF-05, CA-09, CA-15 | completed | none |
| `apps/server/src/tests/routes/space/planets/CreatePlanetRoute.test.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/server/src/tests/routes/space/planets/FetchAllPlanetsRoute.test.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |

### apps/web — rotas, RPC e REST

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/web/src/app/(home)/space/[galaxySlug]/loading.tsx` | Create | RF-13, CA-35 | completed | none |
| `apps/web/src/app/(home)/space/[galaxySlug]/error.tsx` | Create | RF-13, CA-35 | completed | none |
| `apps/web/src/rpc/actions/space/getCurrentGalaxyTrail.ts` | Create | RF-03, RF-12, CA-37 | completed | none |
| `apps/web/src/rpc/actions/space/isFirstStarOfCurrentGalaxy.ts` | Remove | RF-03, RF-12, CA-37 | completed | none |
| `apps/web/src/rpc/actions/space/AccessStarPageAction.ts` | Modify | RF-12, CA-37 | completed | none |
| `apps/web/src/rpc/actions/space/tests/AccessStarPageAction.test.ts` | Modify | RF-12, CA-37 | completed | none |
| `apps/web/src/rpc/actions/challenging/AccessChallengePageAction.ts` | Modify | RF-12, CA-37 | completed | none |
| `apps/web/src/rpc/actions/challenging/tests/AccessChallengePageAction.test.ts` | Modify | RF-12, CA-37 | completed | none |
| `apps/web/src/rest/services/ProfileService.ts` | Modify | RF-04, RF-11, CA-09, CA-32 | completed | none |
| `apps/web/src/rest/services/SpaceService.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |

### apps/web — contexto e hooks de space

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/web/src/ui/space/contexts/SpaceContext/index.tsx` | Modify | RF-03, RF-08, CA-22 | completed | none |
| `apps/web/src/ui/space/contexts/SpaceContext/useSpaceContextProvider.ts` | Modify | RF-03, RF-09, RF-10, CA-24, CA-28, CA-29 | completed | none |
| `apps/web/src/ui/space/contexts/SpaceContext/useCurrentItemScroll.ts` | Create | RF-09, CA-28, CA-29 | completed | none |
| `apps/web/src/ui/space/contexts/SpaceContext/useLastUnlockedStarScroll.ts` | Remove | RF-09, CA-28, CA-29 | completed | none |
| `apps/web/src/ui/space/contexts/SpaceContext/currentItemLayout.ts` | Create | RF-09, CA-28, CA-29 | completed | none |
| `apps/web/src/ui/space/contexts/SpaceContext/lastUnlockedStarLayout.ts` | Remove | RF-09, CA-28, CA-29 | completed | none |
| `apps/web/src/ui/space/contexts/SpaceContext/types/SpaceContextValue.ts` | Modify | RF-03, RF-09, RF-10, CA-24, CA-28 | completed | none |
| `apps/web/src/ui/space/contexts/SpaceContext/types/CurrentItemViewportPosition.ts` | Create | RF-09, CA-28, CA-29 | completed | none |
| `apps/web/src/ui/space/contexts/SpaceContext/types/LastUnlockedStarViewPortPosition.ts` | Remove | RF-09, CA-28, CA-29 | completed | none |
| `apps/web/src/ui/space/contexts/SpaceContext/types/index.ts` | Modify | RF-09, CA-28, CA-29 | completed | none |
| `apps/web/src/ui/space/contexts/SpaceContext/tests/useSpaceContextProvider.test.ts` | Modify | RF-03, RF-09, RF-10, CA-24, CA-28, CA-29 | completed | none |
| `apps/web/src/ui/space/hooks/useOpenPlanetAction.ts` | Create | RF-11, CA-32 | completed | none |

### apps/web — página Galáxia

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/web/src/ui/space/widgets/pages/Space/index.tsx` | Modify | RF-08, RF-09, RF-10, RF-13, CA-22, CA-26, CA-29, CA-30, CA-31, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/SpacePageView.tsx` | Modify | RF-08, RF-09, RF-10, RF-13, CA-22, CA-26, CA-29, CA-30, CA-31, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/useSpacePage.ts` | Modify | RF-08, RF-09, RF-10, RF-13, CA-22, CA-26, CA-29, CA-30, CA-31, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/fab-icon.ts` | Modify | RF-09, CA-29 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/tests/SpacePageView.test.tsx` | Modify | RF-09, RF-13, CA-29, CA-30, CA-31, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/tests/useSpacePage.test.ts` | Modify | RF-09, RF-10, CA-26, CA-29, CA-30 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/TrailLoading/index.tsx` | Create | RF-13, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/TrailLoading/TrailLoadingView.tsx` | Create | RF-13, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/TrailLoading/tests/TrailLoadingView.test.tsx` | Create | RF-13, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/TrailLoadFailure/index.tsx` | Create | RF-13, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/TrailLoadFailure/TrailLoadFailureView.tsx` | Create | RF-13, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/TrailLoadFailure/tests/TrailLoadFailureView.test.tsx` | Create | RF-13, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/TrailEmpty/index.tsx` | Create | RF-13, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/TrailEmpty/TrailEmptyView.tsx` | Create | RF-13, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/TrailEmpty/tests/TrailEmptyView.test.tsx` | Create | RF-13, CA-35 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetails/index.tsx` | Create | RF-10, RF-14, CA-24, CA-25, CA-27 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetails/StarDetailsView.tsx` | Create | RF-10, RF-14, CA-24, CA-25, CA-27 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetails/useStarDetails.ts` | Create | RF-10, CA-24, CA-27 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetails/tests/StarDetailsView.test.tsx` | Create | RF-10, CA-25 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetails/tests/useStarDetails.test.ts` | Create | RF-10, CA-24, CA-27 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetailsSheet/index.tsx` | Create | RF-10, RF-14, CA-26, CA-36 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetailsSheet/StarDetailsSheetView.tsx` | Create | RF-10, RF-14, CA-26, CA-36 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/StarDetailsSheet/tests/StarDetailsSheetView.test.tsx` | Create | RF-10, RF-14, CA-26, CA-36 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/index.tsx` | Modify | RF-08, RF-11, RF-14, CA-22, CA-23, CA-32, CA-33, CA-36 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/PlanetView.tsx` | Modify | RF-08, RF-11, RF-14, CA-22, CA-23, CA-32, CA-33, CA-36 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/usePlanet.ts` | Create | RF-08, RF-11, RF-14, CA-22, CA-23, CA-32, CA-33, CA-36 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/tests/PlanetView.test.tsx` | Create | RF-08, RF-14, CA-22, CA-36 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/tests/usePlanet.test.ts` | Create | RF-11, CA-32, CA-33 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/PlanetLock/index.tsx` | Create | RF-11, CA-32, CA-34 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/PlanetLock/PlanetLockView.tsx` | Create | RF-11, CA-32, CA-34 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/PlanetLock/usePlanetLock.ts` | Create | RF-11, CA-32, CA-34 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/PlanetLock/tests/PlanetLockView.test.tsx` | Create | RF-11, CA-32, CA-34 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/PlanetLock/tests/usePlanetLock.test.ts` | Create | RF-11, CA-32, CA-34 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/index.tsx` | Modify | RF-08, RF-10, RF-14, CA-22, CA-23, CA-24, CA-28 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/StarView.tsx` | Modify | RF-08, RF-10, RF-14, CA-22, CA-23, CA-24, CA-28 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/useStar.ts` | Modify | RF-08, RF-10, RF-14, CA-22, CA-23, CA-24, CA-28 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/tests/StarView.test.tsx` | Modify | RF-08, CA-22, CA-23 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/tests/useStar.test.ts` | Modify | RF-10, CA-24, CA-28 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/AnimatedRocket/index.tsx` | Remove | RF-08, CA-22 | completed | none |
| `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/AnimatedRocket/AnimatedRocketView.tsx` | Remove | RF-08, CA-22 | completed | none |

### apps/web — global, perfil e jornadas

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/lotties.ts` | Modify | RF-11, CA-34 | completed | none |
| `apps/web/src/ui/global/widgets/components/Fab/index.tsx` | Modify | RF-09, CA-29 | completed | none |
| `apps/web/src/ui/global/widgets/components/Animation/types/AnimationName.ts` | Modify | RF-11, CA-34 | completed | none |
| `apps/web/src/ui/global/widgets/components/Animation/types/AnimationProps.ts` | Modify | RF-11, CA-34 | completed | none |
| `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/index.tsx` | Modify | RF-11, CA-34 | completed | none |
| `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/useLottieAnimation.ts` | Modify | RF-11, CA-34 | completed | none |
| `apps/web/public/lotties/planet-lock.json` | Create | RF-11, CA-34 | completed | none |
| `apps/web/src/ui/profile/widgets/pages/Profile/ProfilePageView.tsx` | Modify | RF-07, CA-21 | completed | none |
| `apps/web/src/ui/profile/widgets/pages/Profile/Statistics/StatisticsView.tsx` | Modify | RF-07, CA-21 | completed | none |
| `apps/web/src/ui/profile/widgets/pages/Profile/Statistics/tests/StatisticsView.test.tsx` | Create | RF-07, CA-21 | completed | none |
| `apps/web/src/app/tests/space/space.test.ts` | Modify | RF-09, RF-10, RF-11, RF-13, CA-27, CA-28, CA-32 | completed | none |
| `apps/web/next.config.js` | Modify | RF-08, CA-22 | completed | none |
| `apps/web/src/app/tests/space/galaxies.test.ts` | Modify | RF-08, CA-22 | completed | none |
| `apps/web/src/app/tests/profile/profile.test.ts` | Modify | RF-07, CA-21 | completed | none |

### apps/backoffice

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/backoffice/src/rest/services/ProfileService.ts` | Modify | RF-04, CA-09 | completed | none |
| `apps/backoffice/src/ui/global/widgets/pages/Dashboard/Kpis/KpisView.tsx` | Modify | RF-07, CA-21 | completed | none |
| `apps/backoffice/src/ui/global/widgets/pages/Dashboard/Kpis/tests/KpisView.test.tsx` | Create | RF-07, CA-21 | completed | none |
| `apps/backoffice/src/ui/global/widgets/components/UsersTable/UsersTableView.tsx` | Modify | RF-07, CA-21 | completed | none |
| `apps/backoffice/src/ui/global/widgets/components/UsersTable/UsersTableSkeleton/UsersTableSkeletonView.tsx` | Modify | RF-07, CA-21 | completed | none |
| `apps/backoffice/src/ui/profile/widgets/components/AchievementForm/AchievementFormView.tsx` | Modify | RF-07, CA-21 | completed | none |
| `apps/backoffice/src/rest/services/SpaceService.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/backoffice/src/ui/space/widgets/pages/Planets/usePlanetsPage.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/backoffice/src/ui/space/widgets/pages/Planets/PlanetsPageView.tsx` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/backoffice/src/ui/space/widgets/pages/Planets/PlanetForm/index.tsx` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/backoffice/src/ui/space/widgets/pages/Planets/PlanetForm/PlanetFormView.tsx` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/backoffice/src/ui/space/widgets/pages/Planets/PlanetForm/usePlanetForm.ts` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |
| `apps/backoffice/src/ui/space/widgets/pages/Planets/PlanetCollapsible/PlanetCollapsibleView.tsx` | Modify | RF-01, CA-04 | completed | Revisão 7: remoção do ícone do planeta |

### packages/studio

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `packages/studio/public/projects/planet-lock/scene-1/lottie.json` | Create | RF-11, CA-34 | completed | none |

### CI/CD e scripts

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `.github/workflows/server-app-staging-cd.yml` | Create | RF-15, RF-16, RF-19, CA-38, CA-39, CA-45 | completed | none |
| `scripts/seed-local-assets.mjs` | Modify | RF-01, CA-04 | completed | none |
| `scripts/seed-staging-assets.mjs` | Create | RF-19, CA-44, CA-45 | completed | none |
| `scripts/tests/seed-staging-assets.test.mjs` | Create | RF-19, CA-44, CA-45 | completed | none |
| `scripts/tests/galaxy-trail-migration.integration.test.mjs` | Create | RF-01, RF-02, CA-01, CA-02, CA-03, CA-04 | completed | none |
| `scripts/tests/galaxies-migration.integration.test.mjs` | Modify | RF-02, CA-02 | completed | none |
| `scripts/tests/seed-database.test.mjs` | Modify | RF-16, CA-40 | completed | none |
| `scripts/tests/seed-database.integration.test.mjs` | Modify | RF-01, CA-04 | completed | none |
| `scripts/web-quality.config.json` | Modify | RF-17, CA-41 | completed | none |

### Documentação

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `documentation/architecture.md` | Modify | RF-18, CA-42 | completed | none |
| `documentation/infrastructure.md` | Modify | RF-18, CA-42 | completed | none |
| `documentation/github-flow.md` | Modify | RF-18, CA-42 | completed | none |
| `documentation/tooling.md` | Modify | RF-18, CA-42 | completed | none |

## Criteria without a contracted path

- None
