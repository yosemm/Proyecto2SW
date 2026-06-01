import pg from 'pg';
const { Pool } = pg;

let pool;

async function conectarDatabase() {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('La variable de entorno DATABASE_URL no está configurada.');
  }

  const esLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

  pool = new Pool({
    connectionString: connectionString,
    ssl: esLocal ? false : { rejectUnauthorized: false }
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id VARCHAR(255) PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      "categoriaId" VARCHAR(255),
      estado VARCHAR(50),
      puntuacion DOUBLE PRECISION,
      "fechaRegistro" VARCHAR(100),
      "fechaActividad" VARCHAR(100),
      notas TEXT,
      atributos TEXT,
      activo INTEGER DEFAULT 1
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS registros (
      id VARCHAR(255) PRIMARY KEY,
      itemid VARCHAR(255),
      fecha VARCHAR(100),
      valor TEXT,
      notas TEXT
    )
  `);

  return pool;
}

export default conectarDatabase;