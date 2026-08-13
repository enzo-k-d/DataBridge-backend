export type CadastroInterface = {
    email: string
    password: string
    nome: string
}
export type CadastroResult = {
    message: string
    autenticado: boolean
    token?: string
}
  | {
      message: string
      autenticado: false
    }

export default CadastroInterface;