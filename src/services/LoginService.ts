import type { LoginInterface } from "../interfaces/Login";
import type { LoginResult } from "../interfaces/Login";

async function loginService({email, password}:LoginInterface): Promise<LoginResult> {
    if (email === "root@gmail.com" && password === "root") {
        return {
            message: "Login realizado com sucesso.",
            autenticado: true,
        };
    }

    return {
        message: "E-mail ou senha inválidos.",
        autenticado: false,
    };
}
export default loginService;