export type Usuario = {
  id: string;
  codigo: string;
  nome: string;
  imagem: string;
  situacao: number;
  perfis: string;
  email: string;
}


export enum UsuarioSituacao {
  Rascunho = 0,
  Ativo = 1,
  Suspenso = 6,
  Banido = 8,
  Inativo = 9,
}
