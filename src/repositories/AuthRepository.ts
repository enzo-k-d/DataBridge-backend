import {DataBase} from '../database/pool';


export async function buscarUsuarioByEmail(email: string) {
    const { rows } = await DataBase.query('SELECT ID_USUARIO FROM TB_USUARIOOS WHERE email = $1', [email]);
    return rows;
}

