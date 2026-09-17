import { DataBase } from "../database/pool";
import { IEntidade, BasicDataBase } from "./BasicDataBase";

export interface IUser extends IEntidade {
    name: string,
    email: string,
    pass: string,
    create_at: Date,
    last_login_at: Date
}

export class userDataBase<T extends IUser> extends BasicDataBase<T> {
     
}