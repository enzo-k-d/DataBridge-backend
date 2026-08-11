export type LoginInterface = {
    email: string
    password: string
}

export type LoginResult = {
    message: string
    autenticado: boolean
}