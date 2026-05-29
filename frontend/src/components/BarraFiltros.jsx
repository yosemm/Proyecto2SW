import { useContext } from 'react';
import { StorageContext } from '../context/StorageProvider';
import { CATEGORIAS } from '../utils/categorias';

export function BarraFiltros() {
    const { estadoDatos, setitemsDatos } = useContext(StorageContext);

    return (
        <div>
            <div>
                <label>Buscar: </label>
                <input
                    type="text"
                    value={estadoDatos.busqueda}
                    onChange={(e) => setitemsDatos({ type: 'SET_BUSQUEDA', payload: e.target.value })}
                    placeholder="Nombre del juego"
                />
            </div>

            <div>
                <label>Categoría: </label>
                <select
                    value={estadoDatos.filtroCategoria}
                    onChange={(e) => setitemsDatos({ type: 'FILTRAR_CATEGORIA', payload: e.target.value })}
                >
                    <option value="todas">Todas las categorías</option>
                    {CATEGORIAS.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.emoji} {cat.nombre}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Estado: </label>
                <select
                    value={estadoDatos.filtroEstado}
                    onChange={(e) => setitemsDatos({ type: 'FILTRAR_ESTADO', payload: e.target.value })}
                >
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="jugando">Jugando</option>
                    <option value="completado">Completado</option>
                </select>
            </div>

            <button onClick={() => setitemsDatos({ type: 'LIMPIAR_FILTROS' })}>
                Limpiar Filtros
            </button>
        </div>
    );
}