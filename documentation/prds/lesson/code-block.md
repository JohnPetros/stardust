---
title: Bloco de Código
status: draft
source:
  - type: direct-request
    ref: Revisão das capacidades de leitura, edição e execução aprovada em 2026-10-14
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/24
last_updated_at: 2026-10-14
---

# PRD — Bloco de Código

Disponibiliza para: lesson, apresentação de exemplos, referências, respostas escritas e código gerado em Delégua; consumidores existentes de challenging e autoria, conforme as capacidades habilitadas pelo contexto, sem reformular seus fluxos.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O Bloco de Código apresenta código de forma consistente nos contextos educacionais do Stardust. Leitura, edição e execução são capacidades distintas: permitir executar um programa não exige permitir editar seu conteúdo.

Nas histórias, exemplos de leitura permanecem sem edição e podem oferecer execução opcional e cópia. Código de referência em múltipla escolha permanece somente leitura, sem execução. Questões de escrita oferecem editor totalmente editável, respeitando seus bloqueios temporários de execução e análise. Código gerado pelo Blockly permanece somente leitura e segue a modalidade da atividade.

Este documento define a apresentação e as capacidades comuns. Avaliação, vidas, retomada da tentativa, destaque e narração seguem os PRDs dos contextos consumidores. A revisão não reformula desafios independentes nem ferramentas de autoria existentes.

## 2. Problema e Oportunidade

A revisão anterior de 2026-04-07 vinculava execução a edição e ocultava todas as ações no modo somente leitura. Essa relação conflita com exemplos executáveis sem edição aprovados para as histórias.

Separar as capacidades permite reutilizar o bloco sem liberar ações inadequadas ao conteúdo. A mesma apresentação pode servir à interpretação de código, consulta de exemplos, prática escrita e visualização do código gerado por blocos, preservando a responsabilidade de cada atividade sobre sua avaliação.

Esta revisão é prospectiva; não declara que todos os comportamentos já estejam implementados. Pesquisa competitiva não é necessária para o alinhamento das regras de produto aprovado neste escopo.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | Este PRD canônico, revisão de 2026-10-14 | Autoridade versionada para as capacidades comuns; substitui a vinculação entre edição e execução da revisão de 2026-04-07. |
| S2 | Revisão das capacidades por contexto aprovada em 2026-10-14 | Confirma a separação entre leitura, edição e execução e o alinhamento aos PRDs específicos. |
| S3 | [Escrita de código](code-writing.md), revisão de 2026-10-11 | Define exemplos somente leitura executáveis, editor de resposta, bloqueios, restauração, cópia e análise pelo Jev. |
| S4 | [Múltipla escolha](multiple-choice.md), revisão de 2026-10-11 | Define o código do enunciado como somente leitura e sem execução. |
| S5 | [Programação em blocos](block-programming.md), revisão de 2026-10-11 | Define código gerado somente leitura e execução conforme modalidade da atividade. |
| S6 | [Histórias interativas](lesson-page.md) e [Blocos de texto e narração](text-blocks-and-narration.md), revisões de 2026-10-11 | Definem sequência, histórico, destaque e consumo de narração do contexto. |
| S7 | [Milestone 24](https://github.com/JohnPetros/stardust/milestone/24) | Contexto legado das capacidades de apresentação, cópia, restauração e execução de snippets. |

## 3. Público-alvo

O público principal é o aluno que consulta ou utiliza código nos contextos educacionais do Stardust, especialmente nas histórias e suas atividades, em desktop e mobile.

Como público secundário, consumidores existentes de challenging e autoria reutilizam as capacidades do bloco conforme seus próprios fluxos. Esta revisão não define novas ferramentas nem novas jornadas de autoria.

Jobs to Be Done:

- Quando consultar um exemplo, quero ler, copiar e, quando permitido, executar seu código, para compreender seu comportamento sem alterar o conteúdo apresentado.
- Quando interpretar uma questão de múltipla escolha, quero consultar o código de referência, para responder pela leitura.
- Quando escrever uma solução, quero editar e executar o código conforme a atividade, para construir minha resposta.
- Quando montar um programa com Blockly, quero consultar o Delégua correspondente, para relacionar as representações sem editar diretamente o código gerado.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Separar capacidades de leitura, edição e execução | Nenhuma meta numérica aprovada | Verificar que exemplos podem executar sem edição e referências podem permanecer sem execução. |
| Apresentar ações apropriadas ao contexto | Nenhuma meta numérica aprovada | Verificar as ações de cada modalidade e a ausência de controles incompatíveis. |
| Preservar o código correspondente ao contexto | Nenhuma meta numérica aprovada | Verificar conteúdo fornecido, código atual e código gerado, sem alterações ao alternar a apresentação. |
| Apresentar retorno sem confundir avaliação | Nenhuma meta numérica aprovada | Verificar saída, erro e entrada no terminal, preservando avaliação e vidas sob responsabilidade da atividade. |
| Manter usabilidade | Nenhuma meta numérica aprovada | Verificar leitura, navegação por teclado e uso em telas estreitas. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Somente leitura não significa ausência de execução ou cópia. | Validar separadamente as capacidades habilitadas pelo contexto. |
| Campos vazios podem ser legítimos em escrita do zero. | Não ocultar um editor de resposta apenas por estar vazio; referências sem conteúdo não devem apresentar uma área vazia enganosa. |
| Execução e avaliação são responsabilidades diferentes. | Não tratar saída do terminal como aprovação de resposta. |
| Os contextos possuem bloqueios e persistência próprios. | Validar integração com os PRDs específicos, sem usar regras genéricas para contorná-los. |
| Há consumidores fora das histórias. | Não aplicar a retirada de edição dos exemplos como regra global para desafios ou autoria. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Leitura | Apresentação do código fornecido ou gerado pelo contexto, sem implicar permissão de edição. |
| Edição | Capacidade explicitamente habilitada pelo contexto, sujeita aos bloqueios da atividade. |
| Execução | Capacidade de executar o código correspondente ao contexto, independente da permissão de edição. |
| Código atual | Conteúdo exibido, incluindo alterações permitidas; é o valor usado para cópia e execução quando habilitadas. |
| Código inicial | Conteúdo de referência para restauração em contextos editáveis. |
| Código gerado | Delégua produzido pela montagem Blockly, somente leitura. |
| Saída | Retorno da execução no terminal, distinto de feedback de avaliação. |
| Contexto consumidor | Área que define capacidades, avaliação, bloqueios, persistência e progressão aplicáveis. |

#### RP-01 — Exibir código para leitura

Necessidades do usuário:

- Como aluno, quero consultar um trecho de código legível, para compreender o conteúdo apresentado.

Resultado: o bloco apresenta o código do contexto sem conceder edição ou execução indevidamente.

Atores: aluno; usuário dos consumidores existentes conforme seu contexto.

##### Regras de Negócio

- O código apresentado deve corresponder ao conteúdo fornecido ou gerado pelo contexto.
- Somente leitura deve impedir alterações diretas no código, sem proibir automaticamente cópia ou execução.
- Referências sem conteúdo não devem apresentar uma área vazia enganosa.
- Um editor de resposta vazio deve continuar disponível quando o contexto permitir escrita do zero.
- A simples apresentação do código não deve executá-lo.

##### Regras de Experiência

- O conteúdo deve permanecer legível, organizado por linhas e coerente com a apresentação de código do Stardust.
- O bloco deve se ajustar à largura disponível e oferecer rolagem quando necessária, sem sobrepor os demais elementos.
- A leitura não deve exigir uma interação de edição.

#### RP-02 — Habilitar edição e execução de forma independente

Necessidades do usuário:

- Como aluno, quero ter as capacidades apropriadas à atividade, para consultar, experimentar ou escrever sem ações incompatíveis com seu objetivo.

Resultado: o contexto pode oferecer leitura sem execução, leitura com execução ou edição com execução.

Atores: aluno; usuário dos consumidores existentes conforme seu contexto.

##### Regras de Negócio

- Edição e execução devem depender de habilitação explícita do contexto, sem uma implicar a outra.
- Exemplos de leitura nas histórias devem impedir edição e podem permitir execução opcional.
- Questões de escrita devem permitir edição de todo o conteúdo conforme Escrita de código, incluindo bloqueios durante execução e análise.
- Código gerado pelo Blockly e código de referência em múltipla escolha não devem ser editáveis.
- Alterações permitidas devem ser disponibilizadas ao contexto consumidor para suas regras de execução, avaliação e retomada.
- Consumidores existentes de desafios e autoria devem preservar suas permissões e fluxos próprios.

##### Regras de Experiência

- A interface deve apresentar apenas ações habilitadas no contexto atual.
- Bloqueios temporários devem ser compreensíveis e impedir alteração por qualquer ação que modifique o código, inclusive restauração.
- O aluno deve reconhecer a apresentação de código mesmo quando as capacidades forem diferentes.

#### RP-03 — Restaurar o código inicial quando houver edição

Necessidades do usuário:

- Como aluno, quero retornar ao código inicial quando permitido, para recomeçar minha solução sem recarregar a página.

Resultado: a restauração retorna ao conteúdo inicial no contexto editável, respeitando a confirmação da atividade.

Atores: aluno; usuário dos consumidores existentes conforme seu contexto.

##### Regras de Negócio

- Restaurar deve retornar ao código inicial fornecido pelo contexto quando edição e restauração estiverem habilitadas.
- A ação não deve depender apenas da permissão de execução.
- Restauração de uma questão de escrita deve pedir confirmação quando houver alterações, conforme Escrita de código.
- A ação não deve reiniciar a história, alterar vidas ou contornar os bloqueios da atividade.
- Na visualização do código gerado pelo Blockly, a restauração da montagem deve seguir Programação em blocos, sem transformar o código gerado em editor.

##### Regras de Experiência

- A ação deve ser distinguível do recarregamento da página e do reinício integral da história.
- Cancelar a confirmação deve preservar o conteúdo atual.
- Restaurar não deve exigir recarregar a página.

#### RP-04 — Copiar o código atual quando habilitado

Necessidades do usuário:

- Como aluno, quero copiar o código disponível, para continuar a consulta ou o estudo fora do bloco.

Resultado: a cópia usa o conteúdo atual sem exigir edição ou execução.

Atores: aluno; usuário dos consumidores existentes conforme seu contexto.

##### Regras de Negócio

- Copiar deve usar o código atual exibido, incluindo alterações quando houver edição.
- A cópia deve ser habilitada nos exemplos de leitura e nas questões de escrita conforme Escrita de código.
- A habilitação de cópia não deve depender de o conteúdo ser editável ou executável.
- Cópia não deve modificar o código, avaliar resposta ou consumir vidas.

##### Regras de Experiência

- Quando a cópia for concluída, deve haver confirmação visível.
- Se a área de transferência estiver indisponível, a interface deve continuar utilizável.
- Os controles devem ter nomes acessíveis e permitir uso por teclado.

#### RP-05 — Executar e apresentar o retorno contextual

Necessidades do usuário:

- Como aluno, quero consultar a saída ou o erro do código quando a execução for permitida, para compreender seu comportamento.

Resultado: o contexto executável apresenta saída, erro ou solicitação de entrada no próprio fluxo.

Atores: aluno; usuário dos consumidores existentes conforme seu contexto.

##### Regras de Negócio

- A execução deve depender de ação explícita do usuário e das capacidades do contexto.
- A execução não deve conceder permissão de edição a um exemplo ou código gerado somente leitura.
- Quando houver solicitação de entrada, o sistema deve permitir fornecê-la para continuar a execução; cancelar a entrada interrompe essa execução sem inutilizar o bloco.
- A saída e os erros devem corresponder ao código executado.
- O contexto deve poder executar novamente, respeitando seus bloqueios.
- Em programação em blocos, a execução iniciada por Verificar resposta deve seguir o PRD da atividade, sem exigir uma execução manual anterior.
- Aprovação, reprovação, condição de envio ao Jev e perda de vidas devem permanecer sob os PRDs específicos.

##### Regras de Experiência

- O retorno deve aparecer no terminal Saída integrado e recolhível, conforme os contextos de histórias executáveis.
- Erros de execução não devem quebrar a interface ou apagar o código apresentado.
- O botão Executar deve aparecer somente quando essa ação estiver habilitada na modalidade.
- Feedback de avaliação deve permanecer distinguível da saída do programa.

#### RP-06 — Respeitar o contexto educacional e suas autoridades

Necessidades do usuário:

- Como aluno, quero encontrar as mesmas regras ao consultar código em cada atividade, para compreender o que posso fazer sem ambiguidades.

Resultado: as capacidades comuns são aplicadas conforme a matriz de contextos e os respectivos PRDs.

Atores: aluno; usuário dos consumidores existentes conforme seu contexto.

##### Regras de Negócio

- As capacidades nas histórias devem seguir a matriz abaixo.
- Avaliação, bloqueios de edição, vidas e persistência devem seguir o PRD específico da atividade e Histórias interativas.
- Exemplos devem seguir as regras de destaque e histórico; enunciados e questões devem seguir a composição da atividade.
- Narração de textos e enunciados deve seguir Blocos de texto e narração, sem criar geração de áudio no bloco de código.
- Explicação de código por IA deve permanecer retirada dos blocos de código das histórias, conforme Escrita de código.
- Esta revisão não deve reformular desafios independentes ou ferramentas de autoria.

##### Regras de Experiência

- A interface deve usar os tokens canônicos do projeto e manter legibilidade em desktop e mobile.
- Ações indisponíveis não devem aparecer como se estivessem habilitadas.
- Código somente leitura não deve ser confundido com uma área editável.
- A aba Código do Blockly deve permanecer acessível sem cadeado, conforme Programação em blocos.

### Matriz de capacidades nas histórias

| Contexto | Edição direta do código | Execução | Autoridade de produto |
| --- | --- | --- | --- |
| Exemplo de leitura | Não | Opcional para o aluno quando oferecida; cópia disponível | Escrita de código; Histórias interativas |
| Código no enunciado de múltipla escolha | Não | Não | Múltipla escolha |
| Questão de escrita | Totalmente editável, com bloqueios temporários | Sim, antes da análise da versão atual pelo Jev | Escrita de código |
| Código gerado por programação em blocos | Não | Conforme a modalidade; questões e exemplos de montagem não oferecem execução | Programação em blocos |

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Conteúdo ou editor da atividade | Bloco de Código | Fornecer o código atual, código inicial quando aplicável e capacidades habilitadas. |
| Montagem Blockly | Bloco de Código | Fornecer Delégua gerado somente leitura, atualizado conforme a montagem. |
| Bloco de Código | Contexto consumidor | Apresentar conteúdo, oferecer cópia e restauração quando habilitadas e disponibilizar alterações permitidas. |
| Execução | Bloco de Código e atividade | Fornecer saída, erro ou solicitação de entrada correspondentes ao código executado. |
| PRDs das atividades | Bloco de Código | Definir edição, execução, bloqueios, avaliação, vidas e persistência aplicáveis. |
| Histórias interativas; Blocos de texto e narração | Apresentação do código no contexto | Definir destaque, histórico e narração de textos e enunciados, sem ampliar capacidades indevidamente. |

O grafo identifica responsabilidades de produto, não uma ordem de implementação.

## 7. Jornadas

#### JN-01 — Consultar código de referência sem execução

1. A questão de múltipla escolha apresenta seu código de referência.
2. O aluno consulta o conteúdo somente leitura, sem ação de execução.
3. Usa a leitura para responder à questão, cuja avaliação segue Múltipla escolha.
4. A ausência de conteúdo de referência não deve ser apresentada como uma área vazia enganosa.

#### JN-02 — Consultar e executar um exemplo sem editar

1. A história apresenta um exemplo de leitura com cópia e execução habilitadas.
2. O aluno lê e pode copiar o conteúdo sem poder editá-lo.
3. Se escolher Executar, o código do exemplo é executado e o terminal apresenta o retorno ou erro.
4. O aluno pode continuar sem executar, conforme Histórias interativas.
5. A execução não libera edição nem constitui envio de resposta para avaliação.

#### JN-03 — Escrever, executar e restaurar uma resposta

1. A atividade apresenta o editor vazio ou com código inicial, totalmente editável.
2. O aluno escreve sua solução e executa; o editor respeita o bloqueio temporário definido em Escrita de código.
3. Após execução, a atividade trata a condição de envio para análise da versão atual.
4. Quando permitido, o aluno pode copiar seu código ou restaurar o conteúdo inicial.
5. Se houver alterações, a restauração pede confirmação; cancelar preserva o trabalho.
6. Avaliação, vidas e retomada continuam sob o PRD da questão.

#### JN-04 — Consultar o código gerado por blocos

1. O aluno monta um programa ou consulta um exemplo em Blockly.
2. Alterna para a aba Código e encontra o Delégua correspondente somente leitura.
3. A troca de aba não modifica a montagem.
4. Se a modalidade for executável, as ações seguem Programação em blocos; modalidades de montagem não oferecem execução.
5. A visualização não permite converter alterações de código de volta para blocos.

#### JN-05 — Executar código com entrada

1. Em um contexto executável, o aluno inicia uma execução que solicita entrada.
2. O sistema permite fornecer o dado necessário para continuar.
3. Se a entrada for fornecida, a execução apresenta seu retorno ou erro.
4. Se a entrada for cancelada, a execução é interrompida e o bloco continua disponível para nova execução conforme seu contexto.

#### JN-06 — Recuperar uma ação indisponível ou falha

1. O aluno tenta copiar código, mas a área de transferência está indisponível, ou executa e recebe um erro.
2. O bloco mantém o conteúdo e a interface utilizáveis.
3. O contexto permite nova tentativa da ação quando disponível.
4. Uma falha de execução não deve ser apresentada como aprovação ou reprovação automática; a avaliação segue o PRD da atividade.

## 8. Fora do Escopo

| Área | Exclusão explícita desta revisão |
| --- | --- |
| Avaliação | Regras de correção, Jev e avaliação determinística, definidas nos PRDs das atividades. |
| Persistência | Implementação de salvamento e sincronização; a necessidade de preservar respostas segue os PRDs de escrita e programação em blocos. |
| Progressão e recompensas | Vidas, desbloqueio, conclusão, XP, StarCoins e streak. |
| Autoria | Novas ferramentas ou reformulação dos formulários existentes. |
| Desafios independentes | Mudanças nas regras de edição, execução e avaliação desses fluxos. |
| Explicação por IA | Geração ou regeneração de explicações de código nas histórias, funcionalidade descontinuada nesse contexto. |
| Playback | Reformulação do playback estático, tratado em PRD próprio. |
| Compartilhamento | Versionamento de edições, compartilhamento por link e exportação estruturada. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| Exigir edição sempre que houver execução | Edição e execução são capacidades independentes. |
| Ocultar todas as ações em código somente leitura | Permitir cópia e execução quando habilitadas pelo contexto, mantendo o conteúdo sem edição. |
| Restringir restauração apenas pela permissão de executar | Habilitar restauração conforme edição e contexto. |
| Ocultar um editor de resposta por estar vazio | Preservar a escrita do zero quando prevista pela atividade. |
| Executar código de referência em múltipla escolha | Apresentar somente leitura e sem execução nesse contexto. |
| Editar diretamente o código gerado pelo Blockly | Manter Delégua gerado somente leitura, com capacidades da modalidade da atividade. |
| Aplicar as mudanças dos exemplos a todos os consumidores | Preservar regras próprias dos desafios e da autoria existentes. |
