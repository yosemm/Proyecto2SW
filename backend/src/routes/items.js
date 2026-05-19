import express from 'express';
import conectarDatabase from '../db/database.js';

const router = express.Router();

// GET  
router.get('/', async (req, res) => {
  try {
    const db = await conectarDatabase();
    const items = await db.all('SELECT * FROM items WHERE activo = 1');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los juegos' });
  }
});

// POST 
router.post('/', async (req, res) => {
  try {
    const db = await conectarDatabase();
    const { id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, atributos, activo } = req.body;
    const atributosString = atributos ? JSON.stringify(atributos) : '{}';

    const activoInt = activo ? 1 : 0;

    await db.run(
      `INSERT INTO items (id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, atributos, activo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, atributosString, activoInt]
    );

    res.status(201).json({ mensaje: 'Juego agregado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el juego' });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  try {
    const db = await conectarDatabase();
    const { id } = req.params;
    const { nombre, categoriaId, estado, puntuacion, notas } = req.body;
    const fechaActividad = new Date().toISOString();

    await db.run(
      `UPDATE items 
       SET nombre = ?, categoriaId = ?, estado = ?, puntuacion = ?, notas = ?, fechaActividad = ? 
       WHERE id = ?`,
      [nombre, categoriaId, estado, puntuacion, notas, fechaActividad, id]
    );

    res.json({ mensaje: 'Juego actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el juego' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const db = await conectarDatabase();
    const { id } = req.params;
    const fechaActividad = new Date().toISOString();

    await db.run('UPDATE items SET activo = 0, fechaActividad = ? WHERE id = ?', [fechaActividad, id]);

    res.json({ mensaje: 'Juego archivado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al archivar el juego' });
  }
});

// POST
router.post('/:id/registro', async (req, res) => {
  try {
    const db = await conectarDatabase();
    const { id } = req.params;
    const { valor, notas } = req.body;

    const registroId = crypto.randomUUID();
    const fecha = new Date().toISOString();

    await db.run(
      `INSERT INTO registros (id, itemid, fecha, valor, notas) VALUES (?, ?, ?, ?, ?)`,
      [registroId, id, fecha, valor, notas]
    );

    res.status(201).json({ mensaje: 'Registro de actividad guardado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el registro' });
  }
});

export default router;