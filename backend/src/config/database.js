import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * Inicializa a conexão com o banco SQLite e cria a tabela de usuários
 * garantindo integridade (UNIQUE no e-mail, NOT NULL nos campos obrigatórios).
 */
export async function initDatabase() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      cargo TEXT DEFAULT 'Usuário',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}