export const APP_ERRORS = {
  auth: {
    userNotFound: 'Usuário não encontrado.',
    duplicatedEmail: 'E-mail já utlizado por outro usuário.',
    failedSignUp: 'Erro ao tentar fazer cadastro',
    failedSignInWithOAuth: 'Não foi possível fazer login com sua conta social',
  },
  planets: {
    failedFetching: 'Não foi possível carregar a lista de planetas.',
  },
  avatars: {
    failedAcquiring: 'Erro ao tentar desbloquear esse avatar.',
  },
  rewards: {
    payloadNotFound: 'Premiações não processadas.',
  },
  challenges: {
    failedFetching: 'Erro ao carregar desafio.',
  },
  categories: {
    failedFetching: 'Erro ao buscar categorias.',
  },
  comments: {
    failedlistFetching: 'Erro ao carregar lista de comentários.',
    failedEdition: 'Não foi possível atualizar esse comentário',
    failedPost: 'Não foi possível postar esse comentário',
    failedReply: 'Não foi possível responder esse comentário',
    failedDeletion: 'Não foi possível deletar esse comentário',
    failedUpvoting: 'Não foi possível dar um upvote nesse comentário',
    failedDesupvoting: 'Não foi possível remover o upvote desse comentário',
    failedrepliesFetching: 'Erro ao carregar as resposta para esse comentário.',
    failedReplyDeletion: 'Não foi possível deletar sua resposta',
    failedUserCommentsIdsFetching: 'Erro ao verificar seus comentários votados',
  },
  solutions: {
    failedlistFetching: 'Erro ao carregar lista de soluções.',
  },
  mdx: {
    failedCompiling: 'Não foi possível carregar o conteúdo de texto.',
  },
  documentation: {
    failedDocsFetching: 'Não foi possível carregar o dicionário',
    failedDocUnlocking:
      'Não foi possível desbloquear o tópico do dicionário referente a esse desafio',
  },
  playgrounds: {
    failedCreation: 'Não foi possível criar um novo playground',
    failedFetching: 'Não foi possível carregar sua lista de códigos',
    failedTitleEdition: 'Não deu para editar o título desse código',
    failedCodeEdition: 'Não deu para salvar o código desse código',
    failedDeletion: 'Não deu para deletar esse código',
    failedCoying: 'Não deu para gerar a url para compartilhar esse playground',
  },
}
