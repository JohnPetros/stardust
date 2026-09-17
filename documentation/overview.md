# Visão geral do StarDust

O StarDust é uma plataforma de aprendizagem de programação com uma Web App
para estudantes, uma API compartilhada e um Studio administrativo. O monorepo
usa `@stardust/core` para manter as regras de negócio independentes dos
frameworks e apps adaptadores para Web, Server e Studio.

## Funcionalidades principais

- **Espaço:** trilhas de planetas, estrelas e lições.
- **Desafios:** catálogo público completo em `/challenging/challenges`.
- **Roadmap curado de desafios:** progressão pública versionada em
  `/challenging/roadmap`, com mapa, lista linear acessível, progresso pessoal
  para contas autenticadas, drawer filtrável e acesso contextual aos desafios.
- **Studio:** administração de conteúdo, usuários e métricas.

O roadmap é a entrada padrão do módulo Challenging, enquanto o catálogo
continua disponível para exploração livre. A especificação técnica e o estado
de implementação estão em
[`challenge-roadmap/spec.md`](./features/challenging/challenge-roadmap/spec.md).

## Estado do projeto

O roadmap curado está em implementação integrada. A migration e a curadoria
V1 foram validadas no Supabase local e no Supabase Dev; os fluxos automatizados
da Web e as rotas Server focadas também possuem validação. A conclusão depende
dos gates finais de cobertura, revisão pareada e validação manual visual e
autenticada.

## Arquitetura

O projeto segue Ports and Adapters: o Core contém domínio e use cases, o Server
expõe REST e integra o Supabase, e a Web compõe páginas e widgets. Para as
decisões estruturais detalhadas, consulte
[`architecture.md`](./architecture.md); as regras de execução e validação ficam
em [`sdd.md`](./sdd.md).
