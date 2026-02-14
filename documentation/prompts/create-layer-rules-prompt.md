---
description: Criar um prompt genérico para gerar documento de regras de uma camada da aplicacao
---

# Prompt: Criar Regras de Camada

**Objetivo:** Criar um meta-prompt reutilizavel para gerar um documento de regras arquiteturais de uma camada especifica da aplicacao. O resultado deve padronizar como a camada e descrita, quais limites ela possui, como integra com outras camadas e como validar novas features rapidamente. O prompt deve ser orientado a consistencia, clareza e aplicabilidade no dia a dia do time.

**Entrada:**

- **Obrigatorias:**
  - Nome da camada `{CAMADA}` (ex: UI, REST, RPC, Queue, Core, Database).
  - Objetivo da camada `{OBJETIVO_CAMADA}`.
  - Fontes disponiveis `{FONTES}` (arquivos, links, docs internas).
- **Opcionais:**
  - Stack e frameworks relacionados `{STACK}`.
  - Restricoes do documento `{RESTRICOES}`.
  - Convencoes ja existentes `{CONVENCOES_EXISTENTES}`.
  - Formato de saida esperado `{FORMATO_SAIDA}` (default: Markdown).
  - Nivel de detalhe `{NIVEL_DETALHE}` (resumido, medio, completo).
- **Formato esperado da entrada:**
  - Preferencialmente em bullets.
  - Caminhos de arquivo como `documentation/...`.
  - Trechos de regras e exemplos reais quando existirem.

**Diretrizes de Execucao:**

1. **Entendimento e validacao de contexto**
   - Confirmar objetivo do documento de regras para a camada `{CAMADA}`.
   - Extrair e listar placeholders que serao usados na geracao: `{CAMADA}`, `{OBJETIVO_CAMADA}`, `{DIRETORIOS_GLOBAIS}`, `{PRINCIPIOS}`, `{PADROES_PROJETO}`, `{PADROES_USO}`, `{INTEGRACOES}`, `{CHECKLIST}`, `{REGRAS_FIXAS}`.
   - Validar se as fontes fornecidas sao suficientes para cobrir arquitetura, convencoes e limites da camada.
   - Quando houver lacunas, assumir padroes conservadores e registrar pendencias explicitamente na secao de observacoes.

2. **Levantamento do que ja existe**
   - Consultar arquivos de arquitetura e regras do projeto antes de redigir.
   - Se houver ferramenta de busca no repositorio (MCP Serena), localizar documentos similares da camada e camadas analogas.
   - Se houver duvida de biblioteca/framework, consultar documentacao oficial com ferramenta de docs (MCP Context7).
   - Sem ferramentas, solicitar ao usuario trechos minimos necessarios (arquitetura, convencoes e exemplos de regra).

3. **Geracao da estrutura final**
   - Produzir o documento final com secoes obrigatorias e linguagem prescritiva (deve/nao deve).
   - Explicitar fronteiras da camada: o que pertence, o que nao pertence, e como comunicar com outras camadas.
   - Incluir exemplos praticos de padroes de projeto e padroes de uso aplicados ao contexto `{CAMADA}`.
   - Incluir checklist rapido e objetivo para orientar criacao de novas features.

4. **Checagens finais de qualidade**
   - Verificar consistencia entre principios, padroes e regras de integracao.
   - Verificar se nao ha contradicoes com arquitetura global e regras existentes.
   - Garantir que todas as secoes obrigatorias foram preenchidas.
   - Marcar claramente qualquer premissa adotada e pendencia de informacao.

**Template de Saida (Estrutura Obrigatoria):**

- O documento final deve conter exatamente os titulos de primeiro nivel abaixo:

```markdown
# Regras da Camada {CAMADA}

# Visao Geral
- Objetivo da camada
- Responsabilidades principais
- Limites da camada

# Estrutura de Diretorios Globais
- Mapa de pastas relevantes
- Responsabilidade de cada diretorio
- Regras de organizacao e nomeacao

# Principios Fundamentais
## Deve conter
- Elementos obrigatorios da camada
- Praticas recomendadas

## Nao deve conter
- Antipadroes e acoplamentos proibidos
- Responsabilidades que pertencem a outras camadas

# Padroes de Projeto
- Padroes arquiteturais aceitos
- Como aplicar cada padrao na camada
- Quando evitar cada padrao

# Padroes de Uso Aplicados
- Fluxos comuns da camada
- Exemplos de uso correto
- Erros comuns e como evitar

# Regras de Integracao com Outras Camadas
- Dependencias permitidas e proibidas
- Contratos/interface de comunicacao
- Direcao de dependencia e limites de acoplamento

# Checklist Rapido para Novas Features na Camada
- Itens objetivos de validacao antes de abrir PR
- Criterios minimos de conformidade arquitetural
- Sinais de alerta para revisao tecnica

# Observacoes e Pendencias
- Premissas adotadas
- Informacoes ausentes
- Proximos passos para refinamento
```

4. **Regras:**

- Usar Markdown como formato de saida.
- Nao omitir secoes obrigatorias do template.
- Nao inventar caminhos de arquivo, contratos ou componentes inexistentes.
- Priorizar regras acionaveis e verificaveis em code review.
- Manter linguagem normativa: usar "deve", "nao deve", "pode" com criterio.
- Alinhar o documento com a arquitetura em camadas vigente.
- Se faltar contexto critico, registrar em `# Observacoes e Pendencias` em vez de inferir livremente.
- Evitar genericidade: adaptar exemplos e regras ao contexto de `{CAMADA}` e `{STACK}`.
