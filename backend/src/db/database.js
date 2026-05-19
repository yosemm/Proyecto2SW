import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function conectarDatabase() {
  const db = await open({
    filename: 'juegos.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      categoriaId TEXT,
      estado TEXT,
      puntuacion REAL,
      fechaRegistro TEXT,
      fechaActividad TEXT,
      notas TEXT,
      atributos TEXT,
      activo INTEGER
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS registros (
      id TEXT PRIMARY KEY,
      itemid TEXT,
      fecha TEXT,
      valor TEXT,
      notas TEXT
    )
  `);

  return db;
}

export default conectarDatabase;