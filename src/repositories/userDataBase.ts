import { DataBase } from "../database/pool";
import { IEntidade, BasicDataBase } from "./BasicDataBase";
import { IUser } from "../model/iUsuario.model";

        
export class userDataBase<T extends IUser> extends BasicDataBase<T> {
    constructor() {
        super("user");
    }

    async createUser(user: IUser): Promise<boolean> {
        return await this.add({
            name: user.name,
            email: user.email,
            pass: user.pass,
            create_at: user.create_at,
            last_login_at: user.last_login_at
        });
    }   

    async authenticateUser(user: {email: string, pass: string}): Promise<{ userAuthenticated: boolean, IDuser: number | null }> {
        const res = await this.search("tx_email", user.email);
        if (res && res.pass === user.pass) {
            return { userAuthenticated: true, IDuser: res.id };
        }
        return { userAuthenticated: false, IDuser: null };
    }
}