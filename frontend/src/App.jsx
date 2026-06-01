import { useContext } from 'react';
import { StorageContext } from './context/StorageContext';
import { ThemeContext } from './context/ThemeContextValue';
import { FormularioItem } from './components/FormularioItem';
import { ListaItems } from './components/ListaItems';
import { BarraFiltros } from './components/BarraFiltros';
import { PanelGraficas } from './components/PanelGraficas';
import { useAtajoTeclado } from './hooks/useAtajoTeclado';

function App() {
  const { modo, cambiarModo } = useContext(StorageContext);
  const { tema, cambiarTema } = useContext(ThemeContext);

  useAtajoTeclado('t', cambiarTema);

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
