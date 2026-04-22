export const TOOLS_DESCRIPTIONS = {
  getChallengeProblem: 'Obtém um problema de desafio do cache',
  getNextChallengeSource: 'Obtém a próxima fonte de desafio do banco de dados',
  postChallenge:
    'Cria um rascunho de desafio para a conta autenticada com visibilidade privada',
  getChallenge:
    'Obtém um desafio pelo id quando ele é público ou pertence à conta autenticada',
  updateChallenge:
    'Atualiza um desafio da conta autenticada preservando o autor. É necessários ter todos os campos do desafio existentes para atualizar. As categorias são sempre sobscritas, então caso uma categoria falte, ela será excluida, o que pode ser um comportamento inesperado',
  deleteChallenge:
    'Exclui um desafio da conta autenticada. Requer confirmacao explicita do usuario com `confirmacao: true` e so permite exclusao quando a conta autenticada for a autora do desafio',
  getChallengeCreationInstructions:
    'Obtém as instruções oficiais de criação de desafio e os campos obrigatórios',
  getAllChallengeCategories: 'Obtém todas as categorias de desafio do banco de dados',
  listChallenges: 'Lista desafios com filtros e paginação',
} as const
