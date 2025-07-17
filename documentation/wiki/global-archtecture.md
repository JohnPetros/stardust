
# Introdução 

O StarDust é estruturado como um projeto monorepo, uma estratégia em que múltiplos projetos ou pacotes coexistem em um único repositório de código-fonte. Essa abordagem permite maior integração, organização e reutilização de código. Dentro do monorepo, o StarDust é dividido em duas grandes categorias: aplicações (apps) e pacotes (packages).

As aplicações são os projetos finais e executáveis, como um site em Next.js, um app em React Native ou uma API em Node.js — ou seja, são as interfaces com as quais os usuários realmente interagem. Já os pacotes são bibliotecas reutilizáveis que dão suporte às aplicações, como coleções de componentes (ui-kit), regras de negócio (core), validações de dados (validation) ou configurações compartilhadas (typescript-config). Essa divisão promove uma arquitetura mais limpa, modular e escalável, facilitando a manutenção e evolução do projeto.

## Pacotes

- `core`, pacote destinado a concentrar toda a regra negócio do StarDust
- `validation`, pacote responsável em conter os objetos de schema de validação e transformação de dados utilizando a biblioteca [Zod](https://zod.dev/).
- `email`, pacote responsável em construir e testar templates de e-mail.

## Aplicações

- `web`, aplicação web principal do StarDust, onde os usuários interagem via navegador. O principal framework utilizado é o [Next.js](https://nextjs.org/).
- `email`, aplicação para fazer a construção de templates de e-mail e fazer testes de envio desses templates utilizando a biblioteca [React Email](https://react.email/).
- `mobile`, aplicação mobile principal do StarDust, onde os usuários interagem via aplicativo. Seu desenvolvimento se dá utilizando [React Native](https://reactnative.dev/) e [Expo](https://expo.dev/).
- `admin`, aplicação web na qual é possível fazer o gerenciamento do conteúdo do StarDust e fazer análise de comportamento dos usuários. O principal framework utilizado é o [Vike.js](https://vike.dev/).

> A aplicação `email` é um caso especial, ele serve exclusivamente para testes, por isso não possui processo de deploy, tampouco integra com os outros systemas


## Serviços externos

Serviços externos são sistemas, APIs ou plataformas de terceiros com os quais alguma aplicação StarDust se comunica para realizar alguma funcionalidade que ela mesma não faz sozinha e que não está no repositório principal.

- **[Supabase](https://supabase.com/)**, serviço que fornece o backend do StarDust, provendo recursos como banco de dados PostgreSQL, autenticação, storage e CMS de aquivos estáticos e comunicação via websocket.
- **[Resend](https://resend.com/)**, serviço para envio de e-mails transacionais e programáticos. Sua utilização se dá com integração com o Supabase.
- **[Inngest](https://www.inngest.com/)**, serviço que fornece processamento em nuvem de fila para aplicação de mensageria.


## System Design

System Design é o processo de planejar e arquitetar a estrutura de um sistema de software — ou seja, como diferentes partes de um sistema vão funcionar juntas para resolver um problema real de forma eficiente, escalável e confiável. A seguir segue o diagrama do system Design atual do StarDust.

![image](https://github.com/user-attachments/assets/3681c8a4-4d3d-4c9b-b0eb-7bbfeb69bcf0)

## Ferramentas para desenvolvimento

Ferramentas de desenvolvimento são recursos — como programas, bibliotecas ou serviços — que ajudam desenvolvedores a criar, testar, depurar, manter e melhorar softwares com mais eficiência. As ferramentas utilizadas para ajudar no desenvolvimento das aplicações e pacotes do StarDust são:

- Editor de código: **[Visual Studio Code](https://code.visualstudio.com/)**
- Executor de testes automatizados: **[Jest](https://jestjs.io/pt-BR/)**
- Organizador de apps e pacotes: **Turborepo(https://turbo.build/)**
- Controle de versionamento: **[Git](https://git-scm.com/)**
- Gerenciador de pacotes: **[npm](https://www.npmjs.com/)**
- Linter e formatador de código: **[biome.js](https://biomejs.dev/pt-br/)** 
