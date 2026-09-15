import { DataBase } from "../database/pool";
import { IEntidade, BasicDataBase } from "./BasicDataBase";

export interface IUser extends IEntidade {
    nome: string,
    email: string,
    senha: string,
    data_criacao: Date,
    data_atualizacao: Date
}

export class userDataBase<T extends IUser> extends BasicDataBase<T> {
     
}