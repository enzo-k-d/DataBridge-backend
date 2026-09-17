import { DataBase } from "../database/pool";
import { randomInt } from "node:crypto";

export interface IEntidade {
  id: number;
}

export class BasicDataBase<T extends IEntidade> {
  private tabela: string;

  constructor(tabela: string) {
    this.tabela = tabela;
  }


  // =================================
  // -- Busca / Requisição Sem ID: ---
  // =================================

  // buscar
  async search(column: string, value: unknown): Promise<T | null> {
    const res = await DataBase.query<T>(`
      SELECT * FROM tb_${this.tabela} WHERE ${column}_${this.tabela} = $1`, [value]
    );
    return res.rows[0] ?? null;
  }

  // atualizar 
  protected async set(searchColumn: string, searchValue: unknown, updateColumn: string, newValue: unknown): Promise<boolean> {
    const res = await DataBase.query(
          `update tb_${this.tabela}
            set ${updateColumn} = $1
            where ${searchColumn} = $2`,
          [newValue, searchValue]
        );
      return (res.rowCount ?? 0) > 0;
    }

   // adicionar
  protected async add(newRow: Record<string, unknown>): Promise<boolean> {
    try {
      const id: number = await this.createID();

      const newRecord: Record<string, unknown> = {
        ...newRow,
        [`id_${this.tabela}`]: id
      };

      const columns: string[] = Object.keys(newRecord);
      const values: unknown[] = Object.values(newRecord);

      const placeholders: string[] = values.map(
        (_, index) => `$${index + 1}`
      );

      const res = await DataBase.query(
        `insert into tb_${this.tabela} (${columns.join(", ")})
         values (${placeholders.join(", ")})`,
        values
      );

      return (res.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Erro ao adicionar registro:", error);
      return false;
    }
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



  // ======================
  // --- Criação de ID: ---
  //  (numérico 6 digitos) 
  // ======================

  async createID(): Promise<number> {
    let new_id: number;

    do new_id = randomInt(100_000, 1_000_000);
    while (await this.search("id", new_id) !== null);
    
    return new_id;
  }



  // ==================================
  // --- Busca / Requisição por ID: ---
  // ==================================

  async searchById(id: number): Promise<T | null> {return this.search('id', id);}
  async deleteById(id: number): Promise<boolean> {return this.delete('id', id);}  // true se deletou a entidade do ID passado
  async setById(id: number, column: string, newValue: unknown): Promise<boolean> { return this.set(`id_${this.tabela}`, id, column, newValue);}
}