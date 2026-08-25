import {DataBase} from '../database/pool';


export async function buscarUsuario(email: string) {
    const result = await DataBase.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
}