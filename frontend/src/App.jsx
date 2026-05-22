import { useContext } from 'react';
import { StorageContext } from './context/StorageProvider';
import { ThemeContext } from './context/ThemeContext';
import { FormularioItem } from './components/FormularioItem';
import { ListaItems } from './components/ListaItems';

function App() {
  const { modo, cambiarModo } = useContext(StorageContext);
  const { tema, cambiarTema } = useContext(ThemeContext);

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
      <ListaItems />
    </div>
  );
}

export default App;