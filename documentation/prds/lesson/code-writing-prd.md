---
title: Escrita de código
status: draft
source:
  - type: direct-request
    ref: Questões de escrita de código e exemplos de leitura aprovados em 2026-10-11
  - type: direct-request
    ref: Retorno da explicação de código por IA aos blocos de código das histórias aprovado em 2026-10-31
  - type: direct-request
    ref: Remoção da explicação de código por IA das questões de escrita aprovada em 2026-10-31
last_updated_at: 2026-10-31
---

# PRD — Escrita de código

Disponibiliza para: lesson, questões de escrita de código e exemplos de leitura em Delégua nas histórias; Histórias interativas, resposta aprovada, consequências da avaliação e código em andamento vinculado à tentativa.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

Escrita de código permite que alunos autenticados pratiquem Delégua durante as histórias do Stardust, escrevendo uma solução do zero ou complementando um trecho inicial. O editor da questão é totalmente editável, inclusive em atividades de complementação.

O aluno deve executar a versão atual do código sem erros antes de enviá-la para análise. O Jev avalia a resposta usando código, requisitos da atividade e contexto dessa execução. Todos os requisitos devem ser cumpridos para liberar o avanço.

Exemplos de leitura apresentam código somente leitura, com execução opcional e sem avaliação. A explicação de código por IA está disponível nos exemplos de leitura e no código de referência de múltipla escolha, mas não nas questões de escrita; ela permanece separada da avaliação de respostas pelo Jev.

Este PRD não inclui autoria, programação em blocos ou mudanças na avaliação dos desafios independentes. Progressão, vidas, histórico e conclusão seguem Histórias interativas.

## 2. Problema e Oportunidade

O aluno precisa escrever código também durante a história, em atividades menores e guiadas, antes de enfrentar desafios independentes. A combinação de exemplos de leitura e questões de escrita aproxima a apresentação do conceito da prática na linguagem Delégua.

A execução anterior à análise permite observar o comportamento do código e fornecer esse contexto ao avaliador. Requisitos visíveis esclarecem o que a atividade exige e quais partes ainda precisam ser atendidas.

A revisão é prospectiva: descreve o comportamento aprovado, sem afirmar que ele já está implementado. Pesquisa competitiva não é necessária para as decisões de funcionamento deste escopo.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | Este PRD canônico, revisão de 2026-10-11 | Autoridade versionada para questões de escrita e exemplos de leitura de código nas histórias. |
| S2 | Pedido e decisões de produto aprovados em 2026-10-11 | Define execução anterior à análise, editor editável, Jev, requisitos, vidas, retomada e retirada da explicação de código por IA. |
| S3 | [Histórias interativas](lesson-page-prd.md), revisão de 2026-10-11 | Define sequência, destaque, histórico, vidas, reinício integral e continuidade da tentativa. |
| S4 | [Bloco de Código](code-block-prd.md) | Contexto existente de apresentação, cópia, restauração e execução; as modalidades desta revisão seguem as regras específicas deste PRD. |
| S5 | [Explicação de bloco de código por IA](ai-code-block-explanation-prd.md), revisão de 2026-10-31 | Define a explicação por IA, restaurada nas histórias e distinta da avaliação de respostas pelo Jev. |
| S6 | Decisões de produto aprovadas em 2026-10-31 | Revertem a retirada da explicação por IA nos exemplos e no código de referência e a mantêm fora das questões de escrita. |

## 3. Público-alvo

O público principal é o aluno autenticado que pratica programação em Delégua durante as histórias do Stardust. O contexto inclui desktop, mobile, sessões interrompidas e retomada em outro dispositivo pela mesma conta.

Como público secundário, o aluno que revisa o histórico pode consultar exemplos e respostas aprovadas. Autores e administradores não são o público deste fluxo; suas ferramentas ficam fora do escopo.

Jobs to Be Done:

- Quando estiver aprendendo um conceito, quero escrever e executar uma pequena solução, para praticar o conteúdo antes de um desafio independente.
- Quando receber um trecho inicial, quero poder alterá-lo por completo, para construir minha solução sem regiões protegidas do editor.
- Quando enviar uma resposta, quero ver quais requisitos cumpri, para saber o que ajustar antes de continuar.
- Quando interromper a atividade, quero retomar meu código em andamento, para continuar sem refazer o trabalho.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Oferecer prática escrita durante a história | Nenhuma meta numérica aprovada | Verificar escrita do zero e complementação com editor totalmente editável. |
| Relacionar código executado e código analisado | Nenhuma meta numérica aprovada | Verificar que a análise usa a versão atual executada sem erros e seu contexto correspondente. |
| Tornar os requisitos compreensíveis | Nenhuma meta numérica aprovada | Verificar a apresentação permanente dos requisitos e de seus estados. |
| Aplicar vidas apenas a respostas reprovadas | Nenhuma meta numérica aprovada | Verificar uma vida por avaliação válida com requisito não cumprido, sem penalizar execução ou falhas técnicas. |
| Preservar o trabalho em andamento | Nenhuma meta numérica aprovada | Verificar retomada do código entre sessões e dispositivos e restauração mediante confirmação. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Alterar o código invalida sua execução anterior para envio. | Validar o bloqueio do envio até nova execução da versão atual sem erros. |
| Saída diferente da esperada não equivale a erro que impede executar. | Validar que essa saída ainda permite enviar o código para análise. |
| Todos os requisitos devem ser avaliados. | Uma resposta incompleta do avaliador não deve aprovar nem reprovar a solução. |
| O editor fica congelado durante execução e análise. | Validar que saída e avaliação correspondem ao código exibido. |
| A continuidade acompanha a conta. | Validar retomada entre dispositivos, não apenas o estado local do editor. |
| Jev avalia respostas; a explicação de código por IA é um apoio separado. | Validar que a análise permanece e que a explicação não avalia nem aprova respostas. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Questão de escrita do zero | Atividade na qual o aluno escreve sua solução sem um trecho inicial a completar. |
| Questão de complementação | Atividade que fornece um trecho inicial; todo o editor permanece editável. |
| Exemplo de leitura | Código somente leitura, com execução opcional e sem envio para avaliação. |
| Código atual | Versão exibida no editor; qualquer alteração exige nova execução antes de enviar para análise. |
| Execução apta para análise | Execução concluída sem erros da versão atual do código. Não exige, por si só, saída correta para a atividade. |
| Requisitos da atividade | Condições visíveis que precisam ser cumpridas integralmente para aprovar a resposta. |
| Análise pelo Jev | Avaliação da resposta usando código, requisitos e contexto da execução correspondente. |
| Avaliação válida | Resultado completo que permite determinar o cumprimento de todos os requisitos. |
| Falha de análise | Falha técnica ou resultado incompleto, sem aprovação, reprovação ou perda de vida. |
| Código em andamento | Trabalho ainda não enviado, preservado na tentativa vinculada à conta. |

#### RP-01 — Apresentar questões de escrita e complementação

Necessidades do usuário:

- Como aluno, quero escrever uma solução ou completar um trecho, para praticar Delégua durante a história.

Resultado: a atividade apresenta um editor totalmente editável e os requisitos a cumprir.

Atores: aluno autenticado.

##### Regras de Negócio

- A atividade pode pedir escrita do zero ou complementação de um trecho inicial.
- Todo o editor deve ser editável, inclusive o trecho inicial de complementação; não deve haver regiões protegidas.
- O aluno deve cumprir todos os requisitos da atividade para avançar.
- Progressão, vidas e reinício integral devem seguir Histórias interativas.

##### Regras de Experiência

- O enunciado deve ser um bloco de texto acima da atividade, sem histórico simultâneo.
- Os requisitos devem permanecer visíveis; no desktop, a seção Para avançar deve ficar à esquerda do editor, substituindo a imagem da atividade.
- O editor e os requisitos devem permanecer legíveis e utilizáveis no mobile.
- O cabeçalho do editor da questão não deve apresentar o botão de explicação de código por IA.

#### RP-02 — Apresentar exemplos de leitura em Delégua

Necessidades do usuário:

- Como aluno, quero consultar e executar exemplos, para compreender o conceito antes de escrever uma resposta.

Resultado: exemplos mostram código somente leitura e permitem execução opcional.

Atores: aluno autenticado.

##### Regras de Negócio

- O código dos exemplos deve ser somente leitura.
- A execução dos exemplos deve ser opcional para avançar na história.
- Exemplos não devem ser enviados ao Jev nem avaliados como respostas.
- Executar exemplos não deve consumir vidas.

##### Regras de Experiência

- Exemplos devem seguir as regras de destaque sticky, transições e histórico de Histórias interativas.
- Executar e copiar o código devem permanecer disponíveis nos exemplos de leitura.
- A saída deve ser apresentada no terminal integrado ao bloco de código.
- O botão de explicação de código por IA deve ser apresentado, conforme Explicação de bloco de código por IA.

#### RP-03 — Executar a versão atual do código

Necessidades do usuário:

- Como aluno, quero executar meu código antes da análise, para observar seu comportamento e corrigir erros de execução.

Resultado: a execução apresenta a saída ou erro da versão atual sem avaliar a resposta.

Atores: aluno autenticado.

##### Regras de Negócio

- O aluno deve poder executar o código para experimentar sem consumir vidas.
- Durante a execução, o editor deve ficar bloqueado para alterações.
- Ao terminar ou falhar a execução, o editor da questão deve ser liberado.
- Uma execução concluída sem erros deve habilitar o envio da versão correspondente para análise.
- Saída diferente da esperada não deve impedir o envio, desde que a execução tenha concluído sem erros.
- Erros que impeçam concluir a execução devem ser corrigidos antes de acionar o Jev.

##### Regras de Experiência

- Executar deve ficar no cabeçalho do container da atividade.
- Saída e erros devem aparecer no terminal Saída integrado e recolhível, coerente com o terminal do Stardust.
- O estado de execução deve deixar compreensível o bloqueio temporário do editor.

#### RP-04 — Enviar o código e seu contexto para análise

Necessidades do usuário:

- Como aluno, quero enviar a versão que executei para avaliação, para verificar o cumprimento dos requisitos.

Resultado: o Jev recebe o código atual, os requisitos da atividade e o contexto da execução correspondente.

Atores: aluno autenticado.

##### Regras de Negócio

- O envio deve exigir uma execução concluída sem erros da versão atual do código.
- Qualquer alteração do código deve exigir nova execução antes de enviar, sem reutilizar a execução de uma versão anterior.
- O Jev não deve ser acionado quando essa condição de execução não estiver satisfeita.
- A análise deve considerar código, requisitos da atividade e contexto da execução correspondente.
- Durante a análise, o editor deve permanecer congelado até a conclusão ou falha.

##### Regras de Experiência

- Enviar para análise deve ficar no cabeçalho do container da atividade.
- A interface deve indicar quando é necessário executar novamente antes de enviar.
- O estado de análise deve ser visível e distinguível do estado de execução.

#### RP-05 — Apresentar os requisitos e o feedback de avaliação

Necessidades do usuário:

- Como aluno, quero acompanhar o estado de cada requisito, para entender o que já cumpri e o que falta ajustar.

Resultado: uma avaliação válida atualiza todos os requisitos e libera o avanço somente quando todos forem cumpridos.

Atores: aluno autenticado.

##### Regras de Negócio

- Todos os requisitos devem ser cumpridos para aprovar a resposta.
- Uma avaliação válida que indique qualquer requisito não cumprido deve reprovar a resposta.
- Resultado incompleto do avaliador não deve ser tratado como avaliação válida.
- Após aprovação, o aluno deve acionar Continuar; não deve haver avanço automático.
- Após o avanço, a resposta aprovada deve ficar consultável no histórico conforme Histórias interativas.

##### Regras de Experiência

- Requisitos e seus estados de cumprimento devem permanecer visíveis na seção Para avançar.
- A apresentação deve distinguir requisitos ainda não avaliados, cumpridos e não cumpridos, sem depender apenas de cor.
- O retorno da análise deve ser apresentado no contexto da atividade, separado da saída do programa.
- O aluno deve poder ler o feedback antes de Continuar.

#### RP-06 — Distinguir reprovação de falha da análise

Necessidades do usuário:

- Como aluno, quero corrigir minha resposta sem perder vidas por falhas técnicas, para continuar aprendendo com uma avaliação válida.

Resultado: somente uma análise válida que reprove a resposta consome uma vida.

Atores: aluno autenticado.

##### Regras de Negócio

- Uma avaliação válida com requisito não cumprido deve consumir uma vida, independentemente de quantos requisitos tenham falhado.
- Executar para experimentar e enfrentar erros durante essa execução não deve consumir vidas.
- Falha técnica do Jev ou avaliação incompleta não deve consumir vidas nem aprovar ou reprovar a resposta.
- Após falha da análise, o sistema deve preservar o código, liberar o editor e permitir tentar analisar novamente.
- Se o aluno alterar o código após a falha, deve executá-lo novamente antes de enviar.
- Novas tentativas e esgotamento de vidas devem seguir Histórias interativas.

##### Regras de Experiência

- A interface deve distinguir resposta reprovada, erro de execução e falha técnica ou resultado incompleto da análise.
- A falha da análise deve permitir nova tentativa sem apagar o trabalho do aluno.
- O editor deve ser liberado após a conclusão ou falha da análise, respeitando o estado da tentativa da história.

#### RP-07 — Preservar o código em andamento

Necessidades do usuário:

- Como aluno, quero retomar meu código ainda não enviado, para continuar em outra sessão ou dispositivo.

Resultado: o código em andamento acompanha a tentativa da história e a conta.

Atores: aluno autenticado.

##### Regras de Negócio

- O código ainda não enviado deve ser preservado ao sair ou recarregar a história.
- A retomada deve acompanhar a conta entre dispositivos, conforme Histórias interativas.
- A preservação do código não deve dispensar a condição de execução da versão atual antes de enviar para análise.
- Recomeçar história deve limpar o trabalho da tentativa anterior conforme o reinício integral definido em Histórias interativas.

##### Regras de Experiência

- Ao retomar, o aluno deve encontrar seu código em andamento, sem precisar reconstruí-lo a partir do trecho inicial.
- A retomada deve preservar a diferença entre trabalho em andamento e resposta já aprovada.

#### RP-08 — Restaurar e copiar o código

Necessidades do usuário:

- Como aluno, quero restaurar o ponto inicial ou copiar meu código, para organizar meu trabalho na atividade.

Resultado: restaurar retorna ao código inicial mediante confirmação quando houver alterações; copiar usa o conteúdo atual.

Atores: aluno autenticado.

##### Regras de Negócio

- Restaurar em uma questão deve retornar ao código inicial da atividade.
- Quando houver alterações, restaurar deve pedir confirmação antes de descartá-las.
- Cancelar a confirmação deve preservar o código atual.
- Restaurar não deve alterar vidas nem reiniciar a história.
- Após restaurar, o código deve satisfazer novamente a condição de execução anterior ao envio.
- Copiar deve usar o conteúdo atual do código, sem alterá-lo.
- Restauração não deve permitir contornar o congelamento do editor durante execução ou análise.

##### Regras de Experiência

- Os controles devem ficar no cabeçalho do container da atividade e usar os tokens canônicos do projeto.
- A confirmação deve identificar o descarte das alterações, distinguindo a ação de Recomeçar história.
- A cópia deve oferecer confirmação visível quando concluída.

#### RP-09 — Oferecer a explicação de código por IA fora das questões de escrita

Necessidades do usuário:

- Como aluno, quero pedir uma explicação do código exibido, para compreender exemplos e códigos de referência sem sair da história.

Resultado: exemplos de leitura e código de referência de múltipla escolha oferecem a explicação de código por IA; questões de escrita não a oferecem.

Atores: aluno autenticado.

##### Regras de Negócio

- A explicação de código por IA deve estar disponível nos exemplos de leitura e no código de referência de múltipla escolha.
- Questões de escrita não devem oferecer a explicação de código por IA, para que a resposta reflita o trabalho do aluno.
- Geração, limites de uso e cache seguem Explicação de bloco de código por IA.
- A explicação não deve avaliar, aprovar ou reprovar respostas, nem consumir vidas.
- A avaliação de respostas pelo Jev deve permanecer, conforme os requisitos deste PRD.

##### Regras de Experiência

- O botão de explicar código por IA deve aparecer sempre na barra de ações dos exemplos de leitura e do código de referência, e não deve aparecer no editor das questões de escrita.
- A explicação deve permanecer distinguível do feedback de avaliação pelo Jev.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Histórias interativas | Escrita de código | Fornecer tentativa, sequência, vidas, destaque, histórico e regras de avanço e reinício. |
| Conteúdo da atividade | Escrita de código | Fornecer enunciado, requisitos, modalidade e código inicial; autoria fica fora deste PRD. |
| Execução de Delégua | Escrita de código; Jev | Fornecer saída ou erro e contexto da execução correspondente à versão atual do código. |
| Escrita de código | Jev | Fornecer código, requisitos e contexto da execução para análise da resposta. |
| Jev | Escrita de código | Fornecer a avaliação completa do cumprimento dos requisitos, distinguindo avaliação válida de falha ou resultado incompleto. |
| Conta e tentativa da história | Escrita de código | Preservar o código em andamento e permitir retomada entre dispositivos. |
| Escrita de código | Histórias interativas | Fornecer resposta aprovada, reprovação válida e código da resposta para histórico e continuidade. |
| Explicação de código por IA | Exemplos de leitura e código de referência | Oferecer a explicação do código exibido sem substituir a avaliação das respostas pelo Jev; não atende questões de escrita. |

O grafo registra responsabilidades de produto, não uma ordem de implementação.

## 7. Jornadas

#### JN-01 — Consultar um exemplo de leitura

1. A história apresenta um exemplo de código somente leitura.
2. O aluno consulta o código e pode copiá-lo.
3. Pode executar o exemplo e consultar o terminal Saída, sem avaliação ou consumo de vidas.
4. O exemplo oferece explicação de código por IA, mas não envio ao Jev.
5. O aluno continua a história, tendo executado ou não o exemplo.

#### JN-02 — Escrever e executar uma resposta

1. A atividade apresenta o enunciado, os requisitos e o editor vazio ou com um trecho inicial.
2. O aluno escreve ou complementa o código, podendo editar todo o conteúdo.
3. Aciona Executar; o editor fica temporariamente bloqueado.
4. A execução apresenta saída ou erro e libera o editor ao terminar ou falhar.
5. Se ocorrer erro que impeça concluir a execução, o aluno corrige o código e executa novamente, sem perder vidas.
6. Se a execução concluir sem erros, a versão correspondente pode ser enviada para análise, mesmo que a saída seja diferente da esperada.

#### JN-03 — Enviar e aprovar a resposta

1. O aluno executa a versão atual sem erros e aciona Enviar para análise.
2. O sistema congela o editor e envia código, requisitos e contexto da execução ao Jev.
3. O Jev fornece uma avaliação válida de todos os requisitos.
4. Se todos forem cumpridos, a atividade apresenta seus estados e libera Continuar.
5. O aluno lê o feedback e aciona Continuar.
6. A história prossegue e a resposta aprovada permanece consultável no histórico.

#### JN-04 — Corrigir uma resposta reprovada

1. O Jev fornece uma avaliação válida com um ou mais requisitos não cumpridos.
2. A atividade apresenta os estados dos requisitos e consome uma vida, independentemente da quantidade de requisitos não cumpridos.
3. Enquanto houver vidas, o aluno altera o código para corrigir a resposta.
4. A alteração exige nova execução antes do envio.
5. O aluno executa a versão atual sem erros e pode enviá-la novamente.
6. Se as vidas acabarem, o diálogo e o reinício integral seguem Histórias interativas.

#### JN-05 — Recuperar uma falha de análise

1. O aluno envia uma versão apta para análise.
2. O Jev falha ou retorna uma avaliação incompleta.
3. O sistema preserva o código, libera o editor e informa a falha, sem aprovar, reprovar ou consumir vida.
4. O aluno pode tentar a análise novamente.
5. Se alterar o código, precisa executá-lo novamente sem erros antes de enviar.

#### JN-06 — Interromper e retomar a escrita

1. O aluno escreve código ainda não enviado e interrompe a história.
2. O código em andamento permanece vinculado à tentativa e à conta.
3. Ao retomar na mesma sessão ou em outro dispositivo, o aluno encontra seu trabalho.
4. Continua editando e segue a condição de executar a versão atual sem erros antes da análise.

#### JN-07 — Restaurar o código inicial

1. O aluno aciona Restaurar em uma questão com alterações.
2. O sistema pede confirmação antes de descartar o código atual.
3. Se cancelar, preserva o trabalho.
4. Se confirmar, retorna ao código inicial, sem mudar vidas ou reiniciar a história.
5. Para enviar uma resposta, o aluno deve executar a versão atual sem erros novamente.

## 8. Fora do Escopo

| Área | Exclusão explícita desta versão |
| --- | --- |
| Autoria | Cadastro, edição e publicação de enunciados, requisitos e código inicial. |
| Programação em blocos | Blockly, banco de blocos e avaliação determinística de montagens. |
| Desafios independentes | Mudanças na avaliação e no funcionamento das estrelas de desafio de código. |
| Explicação de código por IA | Regras de geração, limites de uso e cache, definidas em Explicação de bloco de código por IA. |
| Recompensas | Cálculo e apresentação de XP, moedas e streak. |
| Implementação do avaliador | Escolha de modelos, prompts, infraestrutura e contratos técnicos de integração com o Jev. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| Deixar escrita de código somente nos desafios independentes | Incluir atividades menores e guiadas de escrita também nas histórias. |
| Aceitar erros de sintaxe que impeçam executar quando o raciocínio estiver correto | Exigir execução concluída sem erros antes de enviar ao Jev. |
| Enviar após alterar uma versão já executada | Exigir nova execução da versão atual. |
| Proteger partes do trecho inicial | Manter todo o editor editável, inclusive em complementação. |
| Editar durante execução ou análise | Congelar o editor temporariamente e liberá-lo ao término ou falha. |
| Aprovar com parte dos requisitos cumpridos | Exigir cumprimento de todos os requisitos. |
| Penalizar falha técnica ou análise incompleta | Preservar o código e permitir nova tentativa sem consumir vida. |
| Descartar trabalho em andamento ao sair | Preservar código vinculado à tentativa e à conta entre dispositivos. |
| Restaurar imediatamente descartando alterações | Pedir confirmação quando houver alterações. |
| Retirar a explicação de código por IA das histórias | Decisão revertida em 2026-10-31: a explicação permanece nos exemplos de leitura e no código de referência; a avaliação das respostas segue com o Jev. |
| Oferecer a explicação de código por IA também nas questões de escrita | Sem explicação por IA no editor das questões de escrita. |
