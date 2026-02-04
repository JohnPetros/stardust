---
title: Responsividade do Chatbot
application: web
status: concluido
last_updated: 04/02/2026
---

# 1. Objetivo (Obrigatorio)
Adaptar o chatbot assistente para dispositivos moveis (celulares e tablets) criando uma nova aba no slider do desafio para telas menores. No mobile, a aba do assistente fica sempre disponivel. A experiencia desktop permanece com o painel lateral atual e sem alterar o fluxo de conversa ou o uso dos services.

# 2. O que ja existe? (Obrigatorio)

## Camada UI (Widgets)
- **`ChallengeLayoutView`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeLayoutView.tsx`) - _Renderiza o slider no mobile e o painel do assistente no desktop._
- **`ChallengeSlider`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/index.tsx`) - _Entry point do slider mobile e integracao com o store._
- **`ChallengeSliderView`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/ChallengeSliderView.tsx`) - _Tabs e slides do Swiper (Descricao/Codigo/Resultado)._
- **`useChallengeSlider`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/useChallengeSlider.ts`) - _Controle do Swiper, indicador e `tabHandler`._
- **`AssistantChatbot`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/index.tsx`) - _Entry point do assistente com injeccao de service e toast._
- **`AssistantChatbotView`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatbotView.tsx`) - _UI do chatbot (header, historico, mensagens)._

## Camada UI (Stores)
- **`ChallengeStore`** (`apps/web/src/ui/challenging/stores/ChallengeStore/index.ts`) - _Guarda `tabHandler` para o slider mobile._

## Camada UI (Hooks)
- **`useBreakpoint`** (`apps/web/src/ui/global/hooks/useBreakpoint.ts`) - _Define `md` como breakpoint para telas menores._

## Camada UI (Components)
- **`CodeEditorToolbar`** (`apps/web/src/ui/global/widgets/components/CodeEditorToolbar/index.tsx`) - _Toggle do assistente no desktop._

# 3. O que deve ser criado?
Nao ha criacao de novos arquivos. A nova aba reutiliza o widget `AssistantChatbot` e ajusta o slider existente.

# 4. O que deve ser modificado?

## Camada UI (Widgets)
- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/index.tsx`
  - **Mudanca:** Definir `slidesCount` fixo em 4 e repassar para `useChallengeSlider` e `ChallengeSliderView` (aba do assistente sempre presente no mobile).

- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/useChallengeSlider.ts`
  - **Mudanca:** Aceitar `slidesCount` e usar no calculo do deslocamento do indicador (`Math.abs(swiper.translate / slidesCount)`).

- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/ChallengeSliderView.tsx`
  - **Mudanca:** Adicionar nova aba "Assistente" no nav sempre que estiver no mobile.
  - **Mudanca:** Adicionar novo `SwiperSlide` com o widget `AssistantChatbot` no mobile.
  - **Mudanca:** Ajustar layout do nav para `grid-cols-4` e manter o indicador com largura de 1 coluna.

# 5. O que deve ser removido? (Depende da tarefa)
Nenhuma remocao prevista.

- **Layout (mobile):**

```text
ChallengeSlider
|-- Nav Tabs: [Descricao] [Codigo] [Resultado] [Assistente]
|-- Slide 0: ChallengeDescription/TabContent
|-- Slide 1: ChallengeCodeEditorSlot
|-- Slide 2: ChallengeResultSlot
|-- Slide 3: AssistantChatbot
```

- **Referencias:**
  - `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/ChallengeSliderView.tsx`
  - `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeSlider/useChallengeSlider.ts`
  - `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatbotView.tsx`
  - `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeLayoutView.tsx`
  - `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/index.tsx`
