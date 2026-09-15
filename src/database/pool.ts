import { Pool } from 'pg';

const password = process.env.DB_PASSWORD;

if (!password) {
  throw new Error('DB_PASSWORD não configurada.');
}

export const DataBase = new Pool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT) || 11002,
  database: process.env.DB_NAME ?? 'dataflow',
  user: process.env.DB_USER ?? 'dataflow_app',
  password,
  max: 10,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 30_000,
});
