export type LoginInterface = {
  email: string
  password: string
}

export type LoginResult =
  | {
      message: string
      autenticado: true
      token: string
    }
  | {
      message: string
      autenticado: false
    }