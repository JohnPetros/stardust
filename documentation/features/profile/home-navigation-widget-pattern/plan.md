---
title: Header e navegação lateral do layout Home no Widget Pattern — plan
spec: ./spec.md
spec_revision: 3
evaluation: ./evaluation.md
status: in_progress
tasks: none
updated_at: 2026-11-17
---

# Plan — Header e navegação lateral do layout Home no Widget Pattern

## Progress

### apps/web — contexts

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/web/src/ui/profile/contexts/SidebarContext/hooks/useSiderbarContext.ts` | Remove | RF-04, CA-07 | completed | none |
| `apps/web/src/ui/profile/contexts/SidebarContext/hooks/useSidebarContext.ts` | Create | RF-04, CA-07 | completed | none |
| `apps/web/src/ui/profile/contexts/SidebarContext/index.tsx` | Modify | RF-04, CA-07 | completed | none |

### apps/web — widgets do layout Home

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeLayoutView.tsx` | Modify | RF-01, RF-05, CA-08 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/useHomeLayout.ts` | Modify | RF-04, CA-06, CA-07 | completed | revisão 3 (DT-07) |
| `apps/web/src/ui/profile/widgets/layouts/Home/index.tsx` | Modify | RF-04, CA-06, CA-07 | completed | revisão 3 (DT-07, DT-09) |
| `apps/web/src/ui/profile/widgets/layouts/Home/tests/useHomeLayout.test.ts` | Create | RF-04, CA-06, CA-09 | completed | revisão 3 |
| `apps/web/src/ui/profile/widgets/layouts/Home/tests/HomeLayoutView.test.tsx` | Create | RF-02, CA-06, CA-09 | completed | revisão 3 |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeNavigation/index.tsx` | Create | RF-01, RF-02, RF-03, CA-04, CA-06 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeNavigation/HomeNavigationView.tsx` | Create | RF-01, RF-03, RF-07, CA-02, CA-03 | completed | reaberta na revisão 2: o contrato mudou |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeNavigation/useHomeNavigation.ts` | Create | RF-01, RF-02, RF-07, CA-01, CA-02, CA-03, CA-04, CA-06 | completed | reaberta na revisão 2: o contrato mudou |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeNavigation/tests/useHomeNavigation.test.ts` | Create | RF-06, CA-01, CA-02, CA-03, CA-04, CA-09 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeNavigation/tests/HomeNavigationView.test.tsx` | Create | RF-06, CA-02, CA-03, CA-09 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeHeader/index.tsx` | Modify | RF-02, RF-08, CA-05, CA-06 | completed | reaberta na revisão 2: o contrato mudou |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeHeader/useHomeHeader.ts` | Remove | RF-02, RF-08, CA-05, CA-06 | completed | reaberta na revisão 2: o contrato mudou |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeHeader/tests/HomeHeaderView.test.tsx` | Create | RF-06, RF-08, CA-05, CA-09, CA-10 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/home-links.ts` | Modify | RF-07, CA-01, CA-10 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/NavLink/index.tsx` | Modify | RF-07, CA-10 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/NavLink/NavLinkView.tsx` | Modify | RF-07, CA-08, CA-10 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/TabNav/TabNavView.tsx` | Modify | RF-07, CA-10 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/SidenavView.tsx` | Modify | RF-07, CA-08, CA-10 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeHeader/HomeHeaderView.tsx` | Modify | RF-07, RF-08, CA-05, CA-10 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/index.tsx` | Modify | RF-01, RF-03, CA-06 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/SidenavButton/index.tsx` | Modify | RF-03, CA-06 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/tests/Sidenav.test.tsx` | Remove | RF-06, CA-09 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/tests/SidenavView.test.tsx` | Create | RF-06, CA-02, CA-03, CA-09 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidebar/index.tsx` | Modify | RF-01, RF-03, CA-06 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidebar/tests/Sidebar.test.tsx` | Remove | RF-06, CA-09 | completed | none |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidebar/tests/SidebarView.test.tsx` | Create | RF-06, CA-02, CA-09 | completed | none |

### apps/web — componente Icon

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/web/src/ui/global/widgets/components/Icon/types/IconName.ts` | Modify | RF-07, RF-08, CA-10 | completed | none |
| `apps/web/src/ui/global/widgets/components/Icon/PhosphorIcon/icons.ts` | Modify | RF-07, RF-08, CA-10 | completed | none |

### apps/web — assets e geração

| Path | Change | RF/CA | Status | Notes |
| --- | --- | --- | --- | --- |
| `apps/web/public/icons/learn.svg` | Remove | RF-07, CA-10 | completed | none |
| `apps/web/public/icons/challenges.svg` | Remove | RF-07, CA-10 | completed | none |
| `apps/web/public/icons/shop.svg` | Remove | RF-07, CA-10 | completed | none |
| `.code-multivitals-baseline.json` | Generate | CA-09 | completed | none |

## Criteria without a contracted path

- None
