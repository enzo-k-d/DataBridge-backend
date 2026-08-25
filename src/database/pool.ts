import { Pool } from 'pg';

export const DataBase = new Pool({
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     Number(process.env.DB_PORT)  || 5432,
  database: process.env.DB_NAME     ?? 'minha_db',
  user:     process.env.DB_USER     ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'senha',
  max: 10, // máximo de conexões no pool
});