import { useContext, useEffect, useCallback } from 'react';
import { StorageContext } from './context/StorageProvider';
import { ThemeContext } from './context/ThemeContext';
import { FormularioItem } from './components/FormularioItem';
import { ListaItems } from './components/ListaItems';
import { BarraFiltros } from './components/BarraFiltros';
import { PanelGraficas } from './components/PanelGraficas';

function App() {
  const { modo, cambiarModo, guardarItem, eliminarItem } = useContext(StorageContext);
  const { tema, cambiarTema } = useContext(ThemeContext);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const enInput = e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT';

      if (e.key.toLowerCase() === 't' && !enInput) {
        cambiarTema();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cambiarTema]);

  const handleAlternarEstado = useCallback((juego) => {
    const ordenEstados = ['pendiente', 'jugando', 'completado'];
    const siguienteIndice = (ordenEstados.indexOf(juego.estado) + 1) % ordenEstados.length;

    guardarItem({
      ...juego,
      estado: ordenEstados[siguienteIndice],
      fechaActividad: new Date().toISOString()
    });
  }, [guardarItem]);

  const handleEliminar = useCallback((id) => {
    eliminarItem(id);
  }, [eliminarItem]);

  return (
    <div>
      <h1>Backlog de Videojuegos</h1>

      <div>
        <button onClick={cambiarTema}>
          Tema: <strong>{tema.toUpperCase()}</strong>
        </button>

        <button onClick={() => cambiarModo(modo === 'local' ? 'api' : 'local')}>
          Base de Datos: <strong>{modo.toUpperCase()}</strong>
        </button>
      </div>

      <FormularioItem />
      <hr></hr>
      <BarraFiltros />
      <hr></hr>
      <ListaItems />
      <PanelGraficas />
    </div>
  );
}

export default App;