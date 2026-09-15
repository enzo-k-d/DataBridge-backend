import { DataBase } from "../database/pool";

export interface IEntidade {
  id: number;
}

export class BasicDataBase<T extends IEntidade> {
  private tabela: string;

  constructor(tabela: string) {
    this.tabela = tabela;
  }

  // Criação De ID
  async createID(): Promise<IEntidade> {

    do {
      id = Math.floor(Math.random() * 1000000);
    } while (await this.search('id', id) !== null);
    return id
  }

  // =================================
  // -- Busca / Requisição Sem ID: ---
  // =================================

  // buscar
  async search(column: string, value: unknown): Promise<T | null> {
    const res = await DataBase.query<T>(
      `SELECT * FROM tb_${this.tabela} WHERE ${column}_${this.tabela} = $1`,
      [value]
    );
    return res.rows[0] ?? null;
  }

  // mudar
  protected async set(column: string, value: unknown, newValue: unknown): Promise<T | null> {
    const res = await DataBase.query<T>(
        `update tb_${this.tabela}
        set ${column}_${this.tabela} = $1
        where ${column}_${this.tabela} = $2`,
        [newValue, value]
      );
    return res.rows[0] ?? null;
  }

  // adicionar <<<<<<<<<<<< Verificar e editar
  protected async add(newValue:{[key: string]: unknown}): Promise<T | null> {

  }

  // deletar
  protected async delete(column: string, value: unknown): Promise<boolean> {
    const res = await DataBase.query(
      `DELETE FROM tb_${this.tabela} WHERE ${column}_${this.tabela} = $1`, [value]
    );
    return (res.rowCount ?? 0) > 0; // true se deletou algo
  }

  // liste todos
  async listAll(): Promise<T[]> {
    const res = await DataBase.query<T>(`SELECT * FROM tb_${this.tabela}`);
    return res.rows;
  }

  // ==================================
  // --- Busca / Requisição por ID: ---
  // ==================================

  // mudar por ID
  async setById(id: number): Promise<T | null> {
      return this.set('id', id);
  }

  //buscar por ID
  async searchById(id: number): Promise<T | null> {
      return this.search('id', id);
  }
}