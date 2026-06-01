import express from 'express';
import conectarDatabase from '../db/database.js';

const router = express.Router();

// GET - Obtener todos los juegos activos
router.get('/', async (req, res) => {
  try {
    const db = await conectarDatabase();
    const result = await db.query('SELECT * FROM items WHERE activo = 1');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener juegos:', error);
    res.status(500).json({ error: 'Error al obtener los juegos' });
  }
});

// POST - Agregar un nuevo juego
router.post('/', async (req, res) => {
  try {
    const db = await conectarDatabase();
    const { id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, atributos, activo } = req.body;
    const atributosString = atributos ? JSON.stringify(atributos) : '{}';

    const activoInt = activo ? 1 : 0;

    await db.query(
      `INSERT INTO items (id, nombre, "categoriaId", estado, puntuacion, "fechaRegistro", "fechaActividad", notas, atributos, activo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, atributosString, activoInt]
    );

    res.status(201).json({ mensaje: 'Juego agregado' });
  } catch (error) {
    console.error('Error al agregar juego:', error);
    res.status(500).json({ error: 'Error al agregar el juego' });
  }
});

// PUT - Actualizar un juego existente
router.put('/:id', async (req, res) => {
  try {
    const db = await conectarDatabase();
    const { id } = req.params;
    const { nombre, categoriaId, estado, puntuacion, notas } = req.body;
    const fechaActividad = new Date().toISOString();

    await db.query(
      `UPDATE items 
       SET nombre = $1, "categoriaId" = $2, estado = $3, puntuacion = $4, notas = $5, "fechaActividad" = $6 
       WHERE id = $7`,
      [nombre, categoriaId, estado, puntuacion, notas, fechaActividad, id]
    );

    res.json({ mensaje: 'Juego actualizado' });
  } catch (error) {
    console.error('Error al actualizar juego:', error);
    res.status(500).json({ error: 'Error al actualizar el juego' });
  }
});

// DELETE - Archivar un juego (activo = 0)
router.delete('/:id', async (req, res) => {
  try {
    const db = await conectarDatabase();
    const { id } = req.params;
    const fechaActividad = new Date().toISOString();

    await db.query('UPDATE items SET activo = 0, "fechaActividad" = $1 WHERE id = $2', [fechaActividad, id]);

    res.json({ mensaje: 'Juego archivado' });
  } catch (error) {
    console.error('Error al archivar juego:', error);
    res.status(500).json({ error: 'Error al archivar el juego' });
  }
});

// POST - Agregar un registro de actividad para un juego
router.post('/:id/registro', async (req, res) => {
  try {
    const db = await conectarDatabase();
    const { id } = req.params;
    const { valor, notas } = req.body;

    const registroId = crypto.randomUUID();
    const fecha = new Date().toISOString();

    await db.query(
      `INSERT INTO registros (id, itemid, fecha, valor, notas) VALUES ($1, $2, $3, $4, $5)`,
      [registroId, id, fecha, valor, notas]
    );

    res.status(201).json({ mensaje: 'Registro de actividad guardado' });
  } catch (error) {
    console.error('Error al guardar registro:', error);
    res.status(500).json({ error: 'Error al guardar el registro' });
  }
});

export default router;