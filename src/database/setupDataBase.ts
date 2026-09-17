import "dotenv/config";
import { DataBase } from "./pool";

async function criarDataBase(): Promise<void> {
    await DataBase.query(`
        create table if not exists tb_user(
            id_user serial primary key,
            tx_email varchar(100) not null,
            tx_pass varchar(32) not null,
            tx_name varchar(100) not null,
            dt_crate_at timestamp default current_timestamp,
            dt_last_login_at timestamp default current_timestamp


            -- Regras
            constraint id_user unique 
            constraint tx_email unique
            constraint minimo_caracters_senha check(char_length(tx_pass) >= 8)
        );
    `);
}

criarDataBase()
  .then(() => {
    console.log("Tabela criada com sucesso.");
  })
  .catch((erro: unknown) => {
    console.error("Erro ao criar tabela:", erro);
  });