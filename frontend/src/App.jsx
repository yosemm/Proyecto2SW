import { useState, useEffect } from 'react'
import { FormularioItem } from './components/FormularioItem';
import { ListaItems } from './components/ListaItems'

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

  const archivarJuego = (id) => {
    const itemsActuales = items.map(item => {
      if (item.id === id) {
        return { ...item, activo: false, fechaActividad: new Date().toISOString() };
      }
      return item;
    });
    setItems(itemsActuales);
  };

  return (
    <>
      <div className="contenido">
        <h1>Backlog de Videojuegos</h1>
        <span>Total de juegos: {items.length}</span>
        <FormularioItem agregarJuego={agregarJuego} />

        <ListaItems items={items} archivar={archivarJuego} />
      </div>
    </>
  )
}

export default App
