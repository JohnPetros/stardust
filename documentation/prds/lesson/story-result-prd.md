---
title: Resultado e recompensas da história
status: draft
source:
  - type: direct-request
    ref: Resultado, recompensas, nível, streak e recuperação aprovados em 2026-10-11
last_updated_at: 2026-11-14
---

# PRD — Resultado e recompensas da história

Disponibiliza para: lesson, resultado da conclusão de uma história; conta do aluno, XP e StarCoins de conclusão; Trilha e Galáxia, conclusão confirmada e retorno à navegação da trilha.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O resultado da história reconhece a conclusão de uma estrela e apresenta o XP e os StarCoins recebidos pelo aluno autenticado. Cada história possui dois valores fixos de recompensa, concedidos integralmente uma única vez por conta na primeira conclusão.

O registro da conclusão e a concessão devem ocorrer automaticamente ao terminar a história, sem exigir uma ação na tela para receber. O resultado apresenta ganhos confirmados, sem métricas de tempo ou percentual de acertos. Erros afetam vidas durante a história, sem reduzir recompensas.

Quando aplicáveis, o fluxo apresenta a celebração de novo nível e depois a de novo streak, com visualização semanal. A ação principal retorna à Galáxia após as celebrações aplicáveis; consultar a história é uma ação secundária.

Recarregar deve manter o resultado sem repetir ganhos. Falhas de registro ou concessão preservam a conclusão pendente e permitem tentar novamente sem refazer a história. Conquistas, autoria das recompensas e resultados de desafios independentes ficam fora do escopo.

## 2. Problema e Oportunidade

A experiência anterior apresenta recompensas junto a tempo e percentual de acertos. A reformulação da trilha integra questões à história, mantém tentativas até o acerto e usa vidas como consequência dos erros.

O resultado deve refletir essa mudança: reconhecer a conclusão integral e mostrar os ganhos configurados, com celebrações relevantes e retorno ao mapa. Uma concessão única e recuperável evita exigir repetição da história em caso de falha ou conceder novamente ao recarregar.

Esta revisão é prospectiva e não afirma que as regras já estejam implementadas. Pesquisa competitiva não é necessária para as decisões de funcionamento aprovadas neste escopo.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | Este PRD canônico, revisão de 2026-10-11 | Autoridade versionada para o resultado e as recompensas de conclusão de histórias. |
| S2 | Pedido e decisões de produto aprovados em 2026-10-11 | Define valores fixos por história, concessão única, navegação, celebrações, recarregamento, revisão e recuperação. |
| S3 | [Histórias interativas](lesson-page-prd.md), revisão de 2026-10-11 | Define as condições de conclusão da sequência e o encaminhamento ao resultado. |
| S4 | [Trilha e Galáxia](../space/galaxy-page-prd.md), revisão de 2026-10-11 | Define acesso, ordem, desbloqueio, revisão e retorno à navegação da trilha. |
| S5 | Fluxos existentes de RewardingPage, acesso ao resultado e estado diário da conta | Evidência auxiliar da concessão, celebração de nível antes de streak e limite diário existente; não substitui as regras desta revisão. |

## 3. Público-alvo

O público principal é o aluno autenticado que conclui uma história da trilha do Stardust, em desktop ou mobile.

Como público secundário, o aluno que recarrega o resultado ou consulta uma história concluída precisa distinguir recompensas já concedidas de novos ganhos. Autores de recompensas e administradores não são o público deste fluxo.

Jobs to Be Done:

- Quando concluir uma história, quero ver os ganhos confirmados, para reconhecer o avanço na minha conta e na trilha.
- Quando alcançar um novo nível ou ampliar meu streak, quero acompanhar essa celebração, para reconhecer minha evolução.
- Quando terminar o resultado, quero retornar à Galáxia, para escolher a próxima estrela disponível.
- Quando ocorrer uma falha ao registrar a conclusão, quero tentar novamente sem refazer a história, para preservar o trabalho já concluído.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Tornar a recompensa compreensível | Nenhuma meta numérica aprovada | Verificar que os ganhos correspondem aos valores fixos da história e aparecem como confirmados. |
| Conceder uma única vez | Nenhuma meta numérica aprovada | Verificar ausência de ganhos adicionais em revisão, recarregamento e repetição da operação. |
| Celebrar evolução quando aplicável | Nenhuma meta numérica aprovada | Verificar nível antes de streak e ausência de etapas sem evento correspondente. |
| Recuperar falhas sem repetir aprendizagem | Nenhuma meta numérica aprovada | Verificar conclusão pendente preservada e nova tentativa sem refazer a história. |
| Retornar ao mapa | Nenhuma meta numérica aprovada | Verificar retorno à Galáxia após as etapas aplicáveis, sem abrir automaticamente a próxima estrela. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Cada história fornece seus valores fixos de XP e StarCoins. | Os valores concretos do catálogo não são definidos por este PRD; validar o consumo dos valores da história. |
| 60 XP e 20 StarCoins são exemplos ilustrativos. | Não tratá-los como valores universais ou fórmula por questão. |
| Repetições da concessão podem ocorrer por falha ou recarregamento. | Validar concessão única e apresentação dos mesmos ganhos registrados. |
| Ganhos apresentados devem estar confirmados. | Não apresentar uma tentativa de concessão como crédito já recebido. |
| O streak possui limite diário existente. | Não incrementar novamente ao concluir outra história no mesmo dia já registrado, recarregar ou revisar. |
| Conquistas estão fora do escopo. | Não acrescentar resgate ou celebração de conquistas às etapas deste fluxo. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Conclusão da história | Sequência integral percorrida, com questões aprovadas conforme Histórias interativas. |
| Conclusão pendente | História terminada cujo registro ou concessão ainda não foi confirmado; não exige repetir os blocos. |
| XP de conclusão | Valor fixo configurado para a história, recebido integralmente na primeira conclusão pela conta. |
| StarCoins de conclusão | Valor fixo configurado para a história, recebido integralmente na primeira conclusão pela conta. |
| Resultado confirmado | Apresentação da conclusão e dos ganhos efetivamente concedidos. |
| Novo nível | Evolução de nível resultante da concessão, celebrada antes de novo streak quando ambos existirem. |
| Novo streak | Atualização diária de atividade da conta, apresentada com visualização semanal quando gerada pela conclusão. |
| Revisão | Consulta de uma história concluída, sem nova recompensa ou incremento de streak neste fluxo. |

#### RP-01 — Registrar a conclusão e conceder automaticamente

Necessidades do usuário:

- Como aluno, quero receber a recompensa ao concluir a história, para não depender de um clique posterior para registrar meu avanço.

Resultado: a conclusão e os ganhos são registrados automaticamente ao terminar a história.

Atores: aluno autenticado.

##### Regras de Negócio

- A conclusão deve seguir as condições de Histórias interativas.
- Ao concluir, o sistema deve registrar a conclusão da estrela e conceder suas recompensas, sem exigir uma ação para receber na tela de resultado.
- Ganhos só devem ser apresentados como recebidos após confirmação.
- O progresso da trilha deve consumir a conclusão confirmada conforme Trilha e Galáxia.
- Falhas devem seguir RP-07 sem exigir repetir a história.

##### Regras de Experiência

- O resultado deve distinguir confirmação em andamento de conclusão e ganhos confirmados.
- A ação de navegação não deve ser apresentada como condição para receber recompensas.

#### RP-02 — Calcular XP e StarCoins por valores fixos

Necessidades do usuário:

- Como aluno, quero compreender os ganhos da conclusão, para saber quanto recebi por terminar a história.

Resultado: a primeira conclusão concede integralmente os dois valores configurados para a história.

Atores: aluno autenticado.

##### Regras de Negócio

- Cada história deve fornecer um valor fixo de XP de conclusão e um valor fixo de StarCoins de conclusão.
- Na primeira conclusão da história pela conta, XP recebido deve ser igual ao XP configurado e StarCoins recebidos devem ser iguais aos StarCoins configurados.
- Os ganhos devem ser adicionados aos respectivos valores da conta.
- Após a concessão, revisar a história ou repetir a operação deve gerar zero XP adicional e zero StarCoins adicionais, preservando os ganhos já registrados.
- Erros, vidas perdidas, tempo e quantidade de questões não devem aplicar multiplicadores ou descontos sobre os valores configurados.
- Os valores concretos por história pertencem ao conteúdo; este PRD não define uma tabela de preços ou uma fórmula para autoria.

##### Regras de Experiência

- O resultado deve mostrar os ganhos daquela conclusão, distinguindo-os dos totais acumulados da conta.
- XP e StarCoins devem ser identificados separadamente.

Regra de cálculo:

```text
Primeira conclusão ainda não recompensada:
  XP recebido = XP de conclusão configurado na história
  StarCoins recebidos = StarCoins de conclusão configurados na história

Conclusão já recompensada ou revisão:
  XP adicional = 0
  StarCoins adicionais = 0
```

Exemplo ilustrativo: uma história configurada com 60 XP e 20 StarCoins concede 60 XP e 20 StarCoins na primeira conclusão, mesmo que o aluno tenha errado questões antes de terminar. Consultá-la novamente não concede novos ganhos. Esses números não são valores universais.

#### RP-03 — Apresentar o resultado confirmado

Necessidades do usuário:

- Como aluno, quero reconhecer a conclusão e consultar meus ganhos, para entender o resultado da história.

Resultado: a página destaca a conclusão e as recompensas recebidas.

Atores: aluno autenticado.

##### Regras de Negócio

- O resultado deve identificar a história concluída e usar os ganhos confirmados da concessão.
- Não deve apresentar métricas de tempo ou percentual de acertos.
- A apresentação não deve transformar perdas de vidas em desconto adicional de recompensa.

##### Regras de Experiência

- O resultado deve destacar História concluída!, XP e StarCoins.
- A página deve usar os tokens canônicos do projeto e funcionar em desktop e mobile.
- Os valores e os controles devem permanecer legíveis e compreensíveis por teclado e leitores de tela.

#### RP-04 — Manter o resultado ao recarregar

Necessidades do usuário:

- Como aluno, quero recarregar o resultado sem perder a tela ou repetir ganhos, para continuar consultando a conclusão.

Resultado: o recarregamento mantém o resultado com os mesmos ganhos registrados.

Atores: aluno autenticado.

##### Regras de Negócio

- Recarregar o resultado não deve conceder novamente XP ou StarCoins nem incrementar streak.
- A página deve recuperar o resultado correspondente à conclusão, sem tratar o recarregamento como nova conclusão.
- Uma conclusão pendente deve continuar no fluxo de confirmação ou recuperação, sem exigir repetir a história.

##### Regras de Experiência

- O recarregamento não deve retornar automaticamente à Galáxia.
- O resultado deve permanecer disponível para consulta com os valores já confirmados.

#### RP-05 — Celebrar novo nível e novo streak

Necessidades do usuário:

- Como aluno, quero reconhecer a evolução da conta após concluir, para acompanhar meu nível e minha continuidade de estudo.

Resultado: celebrações aparecem apenas quando a conclusão produz os eventos correspondentes.

Atores: aluno autenticado.

##### Regras de Negócio

- Quando houver novo nível e novo streak, a celebração de nível deve preceder a celebração de streak.
- A sequência deve ser recompensas, novo nível quando houver, novo streak quando houver e retorno à Galáxia.
- Etapas sem evento correspondente devem ser omitidas.
- Uma nova conclusão pode contar para streak, respeitando o limite diário existente da conta.
- Revisão, recarregamento e repetição da concessão não devem incrementar streak.

##### Regras de Experiência

- A celebração de nível deve preservar o papel do diálogo existente de novo nível.
- A celebração de streak deve apresentar uma visualização semanal.
- A visualização mensal de streak no perfil não deve ser substituída ou refatorada por este fluxo.
- Continuar deve percorrer as etapas aplicáveis, sem inserir uma tela final genérica adicional.

#### RP-06 — Retornar à Galáxia e permitir revisão

Necessidades do usuário:

- Como aluno, quero retornar ao mapa ou revisar a história, para decidir como continuar o aprendizado.

Resultado: a ação principal retorna à Galáxia após as celebrações aplicáveis; revisar é uma ação secundária.

Atores: aluno autenticado.

##### Regras de Negócio

- Sem celebrações adicionais, a ação principal deve retornar diretamente à Galáxia.
- Havendo celebrações, Continuar deve percorrê-las antes do retorno.
- A ação principal não deve abrir automaticamente a próxima estrela.
- Revisar deve permitir consultar a história concluída, sem nova recompensa ou incremento de streak neste fluxo.
- A consulta das questões aprovadas deve seguir os estados de leitura definidos em Histórias interativas e nos PRDs das atividades.

##### Regras de Experiência

- A revisão deve aparecer como ação secundária, distinguível da ação principal.
- O último passo aplicável deve oferecer retorno à Galáxia.
- A página Galáxia deve aplicar suas próprias regras de ponto de continuidade e navegação.

#### RP-07 — Recuperar falhas sem refazer a história

Necessidades do usuário:

- Como aluno, quero recuperar uma falha ao registrar a conclusão ou receber ganhos, para não repetir uma história já terminada.

Resultado: a conclusão pendente é preservada e pode ser confirmada por nova tentativa.

Atores: aluno autenticado.

##### Regras de Negócio

- Falha de registro ou concessão não deve exigir refazer a história.
- A conclusão pendente deve ser preservada.
- O sistema deve permitir tentar registrar ou confirmar a concessão novamente.
- Repetir a operação não deve duplicar XP, StarCoins ou atualização de streak.
- Uma falha de comunicação após concessão não deve ser tratada como autorização para conceder novamente.
- Ganhos só devem aparecer como recebidos após confirmação do resultado correspondente.

##### Regras de Experiência

- A falha deve apresentar mensagem compreensível e Tentar novamente.
- A interface deve distinguir ganhos pendentes de ganhos confirmados.
- Após recuperação, deve apresentar o resultado confirmado e as etapas aplicáveis.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Histórias interativas | Resultado e recompensas | Fornecer conclusão da sequência e identidade da história e da estrela. |
| Conteúdo da história | Resultado e recompensas | Fornecer os valores fixos de XP e StarCoins de conclusão; autoria fica fora deste PRD. |
| Registro da conclusão e concessão | Conta do aluno; resultado | Confirmar a conclusão e conceder uma única vez os ganhos configurados. |
| Conta do aluno | Resultado | Fornecer ganhos confirmados e eventos aplicáveis de novo nível e novo streak. |
| Resultado | Trilha e Galáxia | Retornar o aluno ao mapa e fornecer conclusão confirmada para progressão. |
| Resultado | Consulta da história | Disponibilizar revisão sem nova recompensa ou incremento de streak. |

O grafo identifica responsabilidades de produto, não uma ordem de implementação.

## 7. Jornadas

#### JN-01 — Concluir e receber ganhos

1. O aluno termina todos os blocos da história e aprova suas questões.
2. O sistema registra automaticamente a conclusão e concede os valores configurados de XP e StarCoins, uma única vez.
3. Após confirmação, apresenta História concluída! e os ganhos recebidos.
4. O aluno não precisa clicar para receber os ganhos.
5. Se não houver novo nível ou novo streak, a ação principal retorna diretamente à Galáxia.

#### JN-02 — Celebrar nível e streak

1. O resultado apresenta os ganhos confirmados.
2. Se houver novo nível, o fluxo apresenta a celebração de nível.
3. Se houver novo streak, apresenta depois a celebração com visualização semanal.
4. Etapas sem evento correspondente são omitidas.
5. Ao terminar as celebrações aplicáveis, o aluno retorna à Galáxia.

#### JN-03 — Recarregar o resultado

1. O aluno recarrega a página de resultado.
2. O sistema recupera a conclusão e os ganhos já registrados.
3. Mantém a apresentação do resultado, sem conceder novamente recompensas ou incrementar streak.
4. O aluno pode consultar o resultado e seguir a navegação disponível.

#### JN-04 — Revisar a história concluída

1. O aluno escolhe a ação secundária de revisão.
2. Consulta a história e as respostas aprovadas conforme seus estados de leitura.
3. A consulta não concede XP, StarCoins nem incremento de streak.
4. A navegação de retorno segue a experiência da história e da Galáxia.

#### JN-05 — Recuperar registro ou concessão pendente

1. O aluno termina a história, mas o registro ou a concessão falha ou não é confirmado.
2. O sistema preserva a conclusão pendente e apresenta Tentar novamente.
3. O aluno tenta confirmar novamente sem refazer a história.
4. A operação recupera ou registra o resultado, sem duplicar ganhos ou incremento de streak.
5. Após sucesso, o sistema apresenta os ganhos confirmados e as celebrações aplicáveis.

#### JN-06 — Concluir outra história no mesmo dia

1. O aluno conclui uma história ainda não recompensada em um dia cuja atividade da conta já foi registrada.
2. Recebe o XP e os StarCoins configurados dessa história, uma única vez.
3. A conclusão não incrementa novamente o streak naquele dia.
4. O resultado apresenta apenas as celebrações correspondentes aos eventos efetivamente gerados, incluindo novo nível se aplicável.

## 8. Fora do Escopo

| Área | Exclusão explícita desta versão |
| --- | --- |
| Conquistas | Regras de desbloqueio, celebrações e resgate de recompensas de conquistas. |
| Perfil | Visualização mensal e outras alterações do streak no perfil. |
| Autoria | Ferramentas de configuração de recompensas e definição dos valores concretos de cada história. |
| Desafios independentes | Mudanças nas regras de recompensa ou no resultado das estrelas de desafio de código. |
| Avaliação de atividades | Correção de questões, requisitos de código, Jev e avaliação de montagens. |
| Gamificação global | Reformulação da curva de níveis, regras globais de quebra de streak, fuso de atividade e outros produtores de atividade da conta. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| Calcular ganhos por tempo ou acertos | Conceder valores fixos configurados por história, sem multiplicadores ou descontos por desempenho. |
| Usar 60 XP e 20 StarCoins como valores universais | Tratar os números como exemplos; usar a configuração de cada história. |
| Exigir clique para receber a recompensa | Registrar conclusão e conceder automaticamente ao terminar. |
| Conceder novamente ao revisar ou recarregar | Uma concessão por história e conta; consulta e repetição não geram ganhos adicionais. |
| Retornar automaticamente à Galáxia ao recarregar | Manter o resultado com os ganhos registrados. |
| Contar revisão como atividade para streak | Apenas nova conclusão conta neste fluxo, respeitando o limite diário existente. |
| Abrir diretamente a próxima estrela | Retornar à Galáxia como destino principal. |
| Mostrar streak antes de novo nível | Manter novo nível antes de novo streak quando ambos existirem. |
| Acrescentar etapa de conquistas | Conquistas ficam fora do escopo deste PRD. |
| Exigir repetição da história em caso de falha | Preservar conclusão pendente e oferecer nova tentativa sem duplicar ganhos. |
