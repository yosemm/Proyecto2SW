import { useState, useEffect } from 'react'
import { FormularioItem } from './components/FormularioItem';

function App() {
  const [items, setItems] = useState(
    () => JSON.parse(localStorage.getItem('items') || '[]')
  );
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const agregarJuego = (datos) => {
    const nuevoJuego = {
      id: crypto.randomUUID(),
      nombre: datos.nombre,
      categoriaId: datos.categoriaId,
      estado: datos.estado,
      puntuacion: datos.puntuacion,
      fechaRegistro: new Date().toISOString(),
      fechaActividad: new Date().toISOString(),
      notas: datos.notas,
      atributos: {},
      activo: true
    };
    setItems(prevItems => [nuevoJuego, ...prevItems]);
  }

  return (
    <>
      <div>
        <h1>Backlog de Videojuegos</h1>
        <span>Total de juegos: {items.length}</span>
        <FormularioItem agregarJuego={agregarJuego} />
      </div>
    </>
  )
}

export default App
