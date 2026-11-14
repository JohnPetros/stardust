---
title: Programação em blocos
status: draft
source:
  - type: direct-request
    ref: Questões e exemplos de programação em blocos aprovados em 2026-10-11
  - type: design-decision
    ref: Banners de feedback de acerto e erro no rodapé, aprovados no design em 2026-10-31
last_updated_at: 2026-10-31
---

# PRD — Programação em blocos

Disponibiliza para: lesson, questões e exemplos de leitura em programação em blocos dentro de histórias; Histórias interativas, resposta aprovada, montagem em andamento e eventos de execução associados à atividade.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

Programação em blocos permite que alunos autenticados aprendam e pratiquem conceitos nas histórias do Stardust por meio de Blockly. A experiência inclui questões de montagem, questões de execução, exemplos de montagem e exemplos executáveis.

O catálogo geral possui nove categorias e 37 variações de blocos. Cada questão oferece apenas os blocos selecionados para a atividade, com limites de quantidade e campos fixos ou editáveis. A montagem gera código Delégua consultável em uma aba somente leitura.

As questões devem ser avaliadas deterministicamente, sem Jev: pela estrutura nas questões de montagem e pelo resultado nas questões de execução. A progressão e as vidas seguem Histórias interativas. Exemplos são somente leitura, sem avaliação, e sua execução é opcional quando disponível.

Este PRD não inclui autoria, editor de animações, edição do Delégua gerado, conversão de código para blocos ou programação em blocos nas estrelas de desafio independente.

## 2. Problema e Oportunidade

O aluno precisa compreender a organização de programas sem depender, em toda atividade, da escrita de sintaxe. A montagem com blocos selecionados concentra a prática nos conceitos que a questão pretende trabalhar, enquanto a consulta do Delégua gerado aproxima a representação visual da linguagem usada no Stardust.

A distinção entre montagem e execução evita apresentar uma ação de executar quando o objetivo é apenas organizar uma estrutura. Exemplos de leitura usam a mesma representação, permitindo relacionar a explicação à prática posterior.

Este documento é prospectivo: estabelece o funcionamento aprovado, sem afirmar que as capacidades já estão implementadas. Pesquisa competitiva não é necessária para as decisões de funcionamento deste escopo.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | Este PRD canônico, revisão de 2026-10-11 | Autoridade versionada para as questões e os exemplos de programação em blocos. |
| S2 | Pedido, catálogo e decisões de produto aprovados em 2026-10-11 | Define modalidades, blocos disponíveis, avaliação determinística, controles, cenas e retomada. |
| S3 | [Histórias interativas](lesson-page.md), revisão de 2026-10-11 | Define sequência, destaque, histórico, vidas, conclusão e continuidade da tentativa. |
| S4 | [Bloco de Código](code-block.md) | Contexto existente de leitura e execução de código; não substitui as regras específicas das modalidades deste PRD. |
| S5 | [Procedures — documentação oficial do Blockly](https://docs.blockly.com/guides/create-custom-blocks/procedures/overview/) | Evidência técnica auxiliar de que definições e chamadas de funções podem manter seu vínculo sem conexão física entre os blocos. |
| S6 | Decisões de design aprovadas em 2026-10-31 | Define o estado no cabeçalho da atividade, os banners de acerto e erro no rodapé e a ação Tentar novamente. |

## 3. Público-alvo

O público principal é o aluno autenticado que aprende programação por meio das histórias do Stardust, em desktop ou mobile. A atividade pode ser interrompida e retomada na mesma conta em outro dispositivo.

Como público secundário, o aluno que consulta exemplos ou respostas aprovadas pode relacionar os blocos ao código Delégua gerado. Autores de conteúdo e administradores não são o público deste fluxo; suas ferramentas ficam fora do escopo.

Jobs to Be Done:

- Quando estiver praticando um conceito, quero montar uma solução com os blocos disponíveis, para exercitar a lógica e a organização do programa.
- Quando consultar um exemplo em blocos, quero visualizar seu código Delégua, para relacionar as duas representações.
- Quando experimentar uma montagem executável, quero observar sua saída e a cena associada, para entender seu comportamento.
- Quando interromper uma atividade, quero retomar minha montagem em andamento, para continuar sem refazer o trabalho.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Oferecer prática com blocos selecionados | Nenhuma meta numérica aprovada | Verificar o catálogo, a seleção por atividade, as quantidades e os campos permitidos. |
| Distinguir montagem de execução | Nenhuma meta numérica aprovada | Verificar as ações e a avaliação correspondentes a cada modalidade. |
| Relacionar blocos e Delégua | Nenhuma meta numérica aprovada | Verificar que a aba Código corresponde à montagem atual e é somente leitura. |
| Avaliar a resposta de forma determinística | Nenhuma meta numérica aprovada | Verificar as estruturas ou resultados definidos pela atividade, incluindo funções separadas válidas. |
| Preservar trabalho e distinguir falhas | Nenhuma meta numérica aprovada | Verificar retomada entre dispositivos, recuperação de salvamento e ausência de penalidade por falhas técnicas. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| O catálogo geral não é a lista oferecida em toda questão. | Validar a restrição ao subconjunto da atividade. |
| Soluções equivalentes dependem de regras explícitas por questão. | Não presumir reconhecimento de toda equivalência possível entre programas. |
| Definições de funções podem estar separadas da sequência principal. | Validar sua relação com chamadas e comandos internos, sem usar a posição visual como critério de acerto. |
| Execução e verificação bloqueiam alterações temporariamente. | Validar que saída, cena e feedback correspondem à montagem exibida. |
| Salvamento pode falhar sem que a montagem seja perdida na página. | Validar preservação local do trabalho, mensagem e nova tentativa de salvamento. |
| Eventos visuais pertencem à atividade. | Validar a reação da cena e a restauração do estado inicial a cada execução. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Catálogo geral | Conjunto de categorias e variações de blocos suportadas nesta versão. |
| Banco da atividade | Subconjunto selecionado do catálogo, apresentado com a aparência dos próprios blocos. |
| Montagem | Estrutura criada com os blocos disponíveis, incluindo campos, encaixes, sequência principal e definições de funções permitidas. |
| Questão de montagem | Avalia a estrutura e a organização, sem oferecer execução. |
| Questão de execução | Avalia o resultado da montagem executada; oferece experimentação independente da verificação. |
| Exemplo de montagem | Apresenta blocos e código gerado somente para leitura, sem execução ou avaliação. |
| Exemplo executável | Apresenta blocos e código gerado somente para leitura, com execução opcional e sem avaliação. |
| Código gerado | Representação Delégua da montagem atual, disponível somente para leitura. |
| Feedback de avaliação | Estado curto no cabeçalho da atividade e banner no rodapé da página, indicando acerto ou erro; distinto da saída do programa. |
| Cena | Imagem ou Lottie associada à atividade, que pode reagir aos eventos de execução. |

### Catálogo de blocos desta versão

O catálogo contém 37 variações em nove categorias. Os nomes abaixo identificam as capacidades disponíveis; cada atividade seleciona seu próprio subconjunto.

| Categoria | Variações de blocos |
| --- | --- |
| Mensagens | Mostrar texto; mostrar valor; ler entrada com uma pergunta. |
| Texto | Texto; juntar textos; tamanho de texto; letra na posição. |
| Variáveis | Criar variável; definir valor; alterar valor; consultar variável. |
| Números e operações | Número; calcular; resto da divisão; arredondar. |
| Lógica e comparações | Comparar; combinar condições; negar condição; booleano. |
| Condições e repetições | Se; se/senão; repetir uma quantidade de vezes; enquanto. |
| Listas | Criar lista; consultar item por posição; adicionar item; definir item por posição; obter tamanho. |
| Funções | Definir função com parâmetros; chamar função; obter resultado de função; retornar valor. |
| Dicionários | Criar dicionário; obter valor por chave; definir entrada; remover entrada; obter chaves. |

O comando visual mostrar deve gerar a operação correspondente de saída em Delégua, como escreva. Campos representam valores configuráveis quando liberados pela atividade; encaixes recebem outros blocos.

#### RP-01 — Oferecer as quatro modalidades

Necessidades do usuário:

- Como aluno, quero reconhecer o papel da atividade, para saber se devo montar uma resposta ou consultar um exemplo.

Resultado: cada modalidade apresenta apenas as capacidades pertinentes.

Atores: aluno autenticado.

##### Regras de Negócio

- Questão de montagem deve avaliar a estrutura e oferecer Verificar resposta, sem Executar.
- Questão de execução deve avaliar o resultado e oferecer Executar e Verificar resposta.
- Exemplo de montagem deve permitir leitura, sem execução ou avaliação.
- Exemplo executável deve permitir execução opcional, sem avaliação.
- Exemplos devem impedir alteração dos blocos e de seus campos.

##### Regras de Experiência

- As ações devem refletir a modalidade, sem controles de verificação em exemplos.
- Questões devem mostrar o enunciado como bloco de texto acima da atividade, sem histórico simultâneo.
- Exemplos devem seguir as regras de destaque e histórico de Histórias interativas.

#### RP-02 — Disponibilizar o catálogo selecionado por atividade

Necessidades do usuário:

- Como aluno, quero trabalhar com os blocos pertinentes ao exercício, para concentrar minha atenção no conceito apresentado.

Resultado: a atividade oferece apenas as variações, quantidades e campos permitidos.

Atores: aluno autenticado.

##### Regras de Negócio

- O banco deve ser restrito aos blocos selecionados para a atividade dentro do catálogo deste PRD.
- Cada atividade pode limitar a quantidade disponível de cada bloco e fixar ou liberar seus campos.
- Os limites e campos fixos devem ser respeitados durante a montagem.
- A seleção por atividade não deve implicar disponibilizar todo o catálogo ao aluno.

##### Regras de Experiência

- O banco deve usar a aparência dos próprios blocos, agrupados por suas categorias, em vez de apenas uma lista de comandos.
- Campos editáveis e encaixes devem ser visualmente distinguíveis.
- O banco e a área de montagem devem permanecer utilizáveis em desktop e mobile.

#### RP-03 — Montar a sequência principal e funções

Necessidades do usuário:

- Como aluno, quero organizar comandos e funções, para construir uma solução com os blocos disponíveis.

Resultado: a montagem permite uma sequência principal conectada e definições de funções separadas válidas.

Atores: aluno autenticado.

##### Regras de Negócio

- A questão deve exigir uma sequência principal conectada.
- Quando funções estiverem disponíveis, suas definições podem ficar separadas da sequência principal.
- Uma definição de função válida não deve ser tratada como comando solto apenas por estar separada.
- A validação deve considerar encaixes, campos, comandos internos e relações entre definições e chamadas, conforme a atividade.
- Comandos soltos devem impedir a avaliação e gerar orientação para organizar a montagem, sem consumir vidas.
- Posição visual no editor não deve substituir a avaliação da estrutura e de suas relações.

##### Regras de Experiência

- O aluno deve poder organizar visualmente a montagem sem que mover um conjunto válido altere seu acerto.
- A orientação sobre comandos soltos deve ser apresentada na atividade e permitir corrigir a montagem.

#### RP-04 — Consultar o código Delégua gerado

Necessidades do usuário:

- Como aluno, quero consultar o código gerado pelos blocos, para relacionar a montagem à linguagem Delégua.

Resultado: as abas Blocos e Código representam a mesma montagem.

Atores: aluno autenticado.

##### Regras de Negócio

- A aba Código deve apresentar o Delégua gerado a partir da montagem atual.
- O código gerado deve ser somente leitura, tanto em questões quanto em exemplos.
- Alternar abas não deve modificar nem descartar a montagem.
- Não deve haver conversão de código escrito de volta para blocos.

##### Regras de Experiência

- As abas devem ser identificadas como Blocos e Código, sem cadeado na aba Código.
- O código deve ser legível, com apresentação coerente com os blocos de código do Stardust.
- A navegação entre abas deve continuar disponível durante execução e verificação.

#### RP-05 — Executar e apresentar a saída

Necessidades do usuário:

- Como aluno, quero executar uma montagem quando essa ação fizer parte da atividade, para observar seu comportamento.

Resultado: a execução usa a montagem atual e apresenta sua saída ou erro no contexto da atividade.

Atores: aluno autenticado.

##### Regras de Negócio

- Executar deve estar disponível apenas em questões de execução e exemplos executáveis.
- Executar para experimentar não deve avaliar a resposta nem consumir vidas.
- Durante a execução, alterações da montagem devem ficar bloqueadas temporariamente, preservando a navegação entre abas.
- Ao terminar, a atividade deve permitir nova execução e, nas questões, novas alterações da montagem.

##### Regras de Experiência

- O botão Executar deve ficar no cabeçalho do container da atividade.
- A saída deve usar a seção Saída integrada ao editor, recolhível e coerente com o terminal do Stardust.
- Erros devem permanecer contextualizados na atividade, sem substituir a montagem.
- Saída de execução não deve ser apresentada como resultado da avaliação.

#### RP-06 — Avaliar deterministicamente a resposta atual

Necessidades do usuário:

- Como aluno, quero verificar minha montagem e receber um resultado consistente, para saber se posso continuar.

Resultado: a atividade aprova ou reprova a resposta atual segundo as regras definidas pela questão, sem Jev.

Atores: aluno autenticado.

##### Regras de Negócio

- Questões de montagem devem avaliar a estrutura e a organização dos blocos.
- Questões de execução devem executar automaticamente a montagem atual ao acionar Verificar resposta e avaliar seu resultado; não devem reutilizar uma saída antiga.
- Cada questão deve definir as soluções aceitas, podendo exigir uma montagem específica ou aceitar equivalentes explicitamente previstas.
- O avaliador não deve presumir reconhecimento de toda equivalência possível entre programas.
- Definições de funções separadas devem poder ser avaliadas por suas estruturas e relações com chamadas ou pelo resultado da execução, conforme a modalidade.
- Durante a verificação, alterações da montagem devem ficar bloqueadas temporariamente, mantendo a navegação pelas abas.
- A resposta aprovada deve liberar Continuar conforme Histórias interativas, sem avanço automático.

##### Regras de Experiência

- Verificar resposta deve ficar no cabeçalho do container da atividade.
- Após a verificação, o cabeçalho da atividade deve apresentar um estado curto, como Resposta aprovada ou Resposta incorreta, sem uma aba separada de resultado da avaliação.
- O resultado também deve aparecer em um banner no rodapé da página, no lugar do rodapé padrão, com título e uma explicação curta definida pela questão.
- Na resposta aprovada, o banner deve usar o modo de acerto e oferecer Continuar; Verificar resposta deve ficar desabilitado.
- Não deve ser apresentada a lista de critérios da abordagem anterior.
- Acerto e erro devem ser identificáveis além da cor.

#### RP-07 — Distinguir resposta incorreta, orientação e falha técnica

Necessidades do usuário:

- Como aluno, quero entender o resultado da verificação e suas consequências, para corrigir minha resposta sem penalidades indevidas.

Resultado: apenas uma resposta avaliada como incorreta consome uma vida.

Atores: aluno autenticado.

##### Regras de Negócio

- Uma resposta enviada e avaliada como incorreta deve consumir uma vida da tentativa da história.
- Um erro do programa do aluno durante a execução realizada pela verificação deve contar como resposta incorreta.
- Comandos soltos devem gerar orientação anterior à avaliação, sem consumir vida.
- Falhas técnicas da plataforma não devem consumir vidas.
- Montar, editar ou usar Executar para experimentar não deve consumir vidas.
- Novas tentativas após erro e esgotamento de vidas devem seguir Histórias interativas.

##### Regras de Experiência

- A atividade deve distinguir feedback de resposta incorreta, orientação de montagem e falha técnica.
- A montagem deve permanecer disponível para correção após uma resposta incorreta, enquanto a tentativa possuir vidas.
- O feedback não deve apresentar experimentação como tentativa de resposta enviada.
- Na resposta incorreta, o banner deve usar o modo de erro, informar a vida perdida e oferecer Tentar novamente no lugar de Continuar.
- Enquanto o banner de erro estiver visível, Verificar resposta deve ficar desabilitado; Executar, restaurar e a edição da montagem continuam disponíveis.
- Tentar novamente deve fechar o banner, restaurar o rodapé padrão e reabilitar Verificar resposta, preservando a montagem atual.

#### RP-08 — Restaurar a montagem inicial

Necessidades do usuário:

- Como aluno, quero retornar à montagem inicial quando necessário, para recomeçar a atividade sem reiniciar toda a história.

Resultado: a restauração descarta alterações da atividade mediante confirmação quando necessário.

Atores: aluno autenticado.

##### Regras de Negócio

- Restaurar deve retornar à montagem inicial fornecida pela atividade.
- Quando houver alterações, a ação deve solicitar confirmação antes de descartá-las.
- Cancelar a confirmação deve preservar a montagem atual.
- Restaurar não deve alterar vidas nem reiniciar a história.
- A restauração não deve permitir modificar um exemplo somente leitura nem contornar o bloqueio durante execução e verificação.

##### Regras de Experiência

- A confirmação deve deixar claro que as alterações da montagem serão descartadas.
- A ação deve ser distinguível de Recomeçar história, que reinicia toda a tentativa.

#### RP-09 — Preservar a montagem em andamento

Necessidades do usuário:

- Como aluno, quero retomar minha montagem ainda não enviada, para continuar o trabalho após interromper a atividade.

Resultado: a montagem em andamento acompanha a tentativa e a conta entre sessões e dispositivos.

Atores: aluno autenticado.

##### Regras de Negócio

- A montagem ainda não enviada deve ser preservada ao sair ou recarregar, vinculada à tentativa da história.
- A retomada deve acompanhar a conta entre dispositivos, conforme Histórias interativas.
- Se o salvamento falhar, o trabalho deve ser mantido na página e a atividade deve continuar utilizável.
- A falha de salvamento não deve ser apresentada como sincronização concluída.
- Recomeçar história deve limpar a montagem da tentativa anterior conforme o reinício integral definido em Histórias interativas.

##### Regras de Experiência

- Uma falha de salvamento deve mostrar Não foi possível salvar seu progresso e oferecer Tentar novamente.
- A mensagem não deve indicar que o trabalho já está disponível em outro dispositivo.
- A retomada deve permitir continuar a montagem sem exigir que ela já tenha sido enviada para avaliação.

#### RP-10 — Apresentar cenas e composição responsiva

Necessidades do usuário:

- Como aluno, quero observar a cena relacionada ao programa, para compreender visualmente o efeito de sua execução.

Resultado: a atividade apresenta sua imagem ou Lottie e, quando configurado, reage aos eventos da execução.

Atores: aluno autenticado.

##### Regras de Negócio

- A atividade pode possuir uma imagem ou um Lottie associado.
- Nas modalidades executáveis, a cena pode reagir aos eventos definidos pela atividade.
- Cada execução, inclusive a realizada ao verificar uma questão de execução, deve começar com a cena restaurada ao estado inicial.
- A reação visual deve corresponder à montagem executada e não substituir a avaliação determinística.
- A atividade deve fornecer sua configuração de eventos; não deve ser necessário oferecer comandos de animação ao aluno.

##### Regras de Experiência

- Em questões no desktop, a imagem ou cena deve ficar à esquerda da área de programação.
- Em questões no mobile, a ordem deve ser enunciado, imagem ou cena e editor.
- Exemplos de leitura devem seguir a composição e o destaque sticky de Histórias interativas.
- Os controles do cabeçalho da atividade devem ter altura de 32 e usar os tokens canônicos do projeto.
- Banco de blocos, abas, terminal e controles devem permanecer utilizáveis em telas estreitas.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Histórias interativas | Programação em blocos | Fornecer a tentativa, o ponto da sequência, vidas, progressão, destaque e histórico. |
| Conteúdo da atividade | Programação em blocos | Fornecer modalidade, montagem inicial, blocos selecionados, quantidades, campos, soluções aceitas e configuração da cena. A autoria fica fora deste PRD. |
| Programação em blocos | Leitura e execução de Delégua | Fornecer a representação da montagem atual e apresentar sua execução quando aplicável. |
| Avaliação determinística | Programação em blocos | Verificar estruturas ou resultados definidos pela atividade e distinguir resposta incorreta de falha técnica. |
| Execução da atividade | Cena associada | Fornecer eventos correspondentes à execução, com restauração inicial a cada execução. |
| Conta e tentativa da história | Programação em blocos | Preservar a montagem em andamento e disponibilizá-la na retomada entre dispositivos. |
| Programação em blocos | Histórias interativas | Fornecer resposta aprovada, consequência de resposta incorreta e montagem da atividade para consulta e continuidade. |

O grafo descreve responsabilidades de produto, não uma ordem de implementação.

## 7. Jornadas

#### JN-01 — Consultar um exemplo de montagem

1. A história apresenta o exemplo como bloco de leitura, podendo colocá-lo em destaque.
2. O aluno consulta a montagem sem poder alterar blocos ou campos.
3. Pode alternar para Código e consultar o Delégua gerado.
4. A atividade não oferece Executar nem Verificar resposta.
5. O aluno continua a história; o exemplo passa a integrar o histórico conforme a progressão definida.

#### JN-02 — Consultar e executar um exemplo

1. A história apresenta um exemplo executável somente leitura.
2. O aluno consulta as abas Blocos e Código.
3. Se escolher Executar, a cena é restaurada ao estado inicial e a montagem é executada.
4. A seção Saída apresenta o retorno ou erro contextualizado; a cena reage aos eventos definidos.
5. Não há avaliação nem perda de vida. A execução não é obrigatória para continuar a história.

#### JN-03 — Responder uma questão de montagem

1. O sistema apresenta o enunciado e o banco restrito aos blocos da atividade.
2. O aluno organiza a sequência principal e, quando permitido, definições de funções separadas.
3. Aciona Verificar resposta, sem executar o programa.
4. Se houver comandos soltos, recebe orientação sem perda de vida e pode organizar a montagem.
5. Se a montagem estiver apta à avaliação, o sistema bloqueia alterações temporariamente e avalia a estrutura.
6. Resposta incorreta apresenta o banner de erro e consome uma vida; resposta aprovada apresenta o banner de acerto e libera Continuar.
7. Ao continuar, a resposta aprovada permanece consultável no histórico conforme Histórias interativas.

#### JN-04 — Experimentar e verificar uma questão de execução

1. O aluno monta uma solução com os blocos da questão.
2. Pode usar Executar para experimentar, sem avaliação ou perda de vida.
3. A execução bloqueia alterações, restaura a cena e apresenta a saída correspondente à montagem atual; ao terminar, permite novas alterações.
4. Ao acionar Verificar resposta, o sistema verifica a organização da montagem, sem penalizar comandos soltos.
5. Estando apta à avaliação, a montagem atual é executada novamente com alterações bloqueadas; uma saída antiga não é usada como resposta.
6. O sistema avalia o resultado:
   - Resposta aprovada: apresenta o banner de acerto e libera Continuar.
   - Resposta incorreta ou erro do programa durante a verificação: apresenta o banner de erro e consome uma vida.
   - Falha técnica: informa a falha sem consumir vida.
7. O aluno continua após aprovação ou, enquanto houver vidas, aciona Tentar novamente e corrige a montagem.

#### JN-05 — Restaurar a montagem

1. O aluno aciona Restaurar em uma questão editável.
2. Se houver alterações, o sistema pede confirmação para descartá-las.
3. Ao cancelar, a montagem permanece intacta.
4. Ao confirmar, a atividade retorna à montagem inicial, sem alterar vidas ou reiniciar a história.

#### JN-06 — Interromper, retomar e recuperar o salvamento

1. O aluno monta uma resposta ainda não enviada.
2. A montagem é preservada na tentativa vinculada à conta.
3. Ao sair ou recarregar, o aluno pode retomar o trabalho, inclusive em outro dispositivo.
4. Se o salvamento falhar, a montagem permanece na página e a atividade continua utilizável.
5. O sistema mostra Não foi possível salvar seu progresso e Tentar novamente, sem indicar sincronização concluída.
6. O aluno tenta salvar novamente; após sucesso, a montagem pode ser retomada pela conta.

#### JN-07 — Consultar uma questão aprovada

1. O aluno avança após aprovar uma questão.
2. A história disponibiliza a atividade e sua resposta aprovada no histórico.
3. O aluno consulta os blocos e o código gerado sem alterar a resposta aprovada.
4. A consulta não constitui uma nova tentativa de avaliação nem altera vidas.

## 8. Fora do Escopo

| Área | Exclusão explícita desta versão |
| --- | --- |
| Autoria | Ferramentas para cadastrar atividades, selecionar blocos, editar soluções aceitas ou configurar eventos. |
| Avaliação por modelo | Jev ou outro avaliador baseado em modelo para questões de programação em blocos. |
| Código escrito | Edição do Delégua gerado e conversão de Delégua escrito para blocos. |
| Desafios independentes | Uso de Blockly nas estrelas de desafio de código. |
| Animações | Editor de animações; a atividade apenas consome a cena e sua configuração de eventos. |
| Expansão do catálogo | Variações não listadas no catálogo desta revisão, como senão se, percorrer listas, remover item de lista e verificar existência de chave em dicionário. |
| Equivalência geral | Reconhecimento automático de todas as soluções semanticamente equivalentes possíveis. |
| Recompensas | Cálculo e apresentação de XP, moedas e streak. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| Disponibilizar todos os blocos em toda questão | Oferecer apenas o subconjunto selecionado para a atividade, com quantidades e campos configurados. |
| Usar Jev na avaliação de blocos | Avaliação determinística de estrutura ou resultado. |
| Exibir lista de critérios e uma aba de resultado da avaliação | Estado no cabeçalho da atividade e banner no rodapé, sem lista de critérios nem aba separada de avaliação. |
| Apresentar o feedback apenas acima do editor | Usar também o banner de acerto ou erro no rodapé, como nas demais questões da história. |
| Tratar Saída como resultado da avaliação | Saída é o retorno do programa; feedback informa a aprovação ou reprovação. |
| Exigir execução manual anterior à verificação | Verificar resposta executa automaticamente a montagem atual nas questões de execução. |
| Penalizar comandos soltos | Orientar antes da avaliação, sem perda de vida. |
| Tratar uma função separada válida como comando solto | Permitir definições de funções separadas da sequência principal e avaliar suas relações. |
| Manter a montagem editável durante execução ou verificação | Bloquear alterações temporariamente, mantendo a navegação entre abas. |
| Descartar alterações imediatamente ao restaurar | Solicitar confirmação quando houver alterações. |
| Preservar apenas respostas já aprovadas | Preservar também a montagem em andamento, vinculada à tentativa e à conta. |
| Adiar cenas por evento | Incluir cenas reativas nesta versão, restaurando o estado inicial a cada execução. |
| Edição bidirecional entre blocos e código | Código Delégua gerado somente leitura, sem conversão de volta para blocos. |
