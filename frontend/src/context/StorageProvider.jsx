import { createContext, useState, useEffect, useReducer, useMemo } from 'react';
import { itemsReducer, estadoInicial } from '../reducers/itemsReducer';
import { CATEGORIAS } from '../utils/categorias';

export const StorageContext = createContext();

const obtenerCategoriaId = (valorCategoria) => {
    const valor = (valorCategoria || '').toString().trim().toLowerCase();
    const categoria = CATEGORIAS.find((cat) =>
        cat.id.toLowerCase() === valor || cat.nombre.toLowerCase() === valor
    );

    return categoria ? categoria.id : valor;
};

export function StorageProvider({ children }) {

    const [modo, setModo] = useState(
        () => localStorage.getItem('modoDatos') || 'local'
    );

    const [estadoDatos, setitemsDatos] = useReducer(itemsReducer, estadoInicial);

    const API_URL = '/api/items';

    const cambiarModo = (nuevoModo) => {
        setModo(nuevoModo);
        localStorage.setItem('modoDatos', nuevoModo);
    };

    const obtenerItemsDatos = async () => {
        if (modo === 'api') {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const itemsAPI = await response.json();

                setitemsDatos({ type: 'HIDRATAR', payload: { items: itemsAPI, registros: [] } });
            } catch (error) {
                console.error('Error al conectar con la API:', error);
            }
        } else {
            const datosLocales = JSON.parse(localStorage.getItem('items') || '[]');
            setitemsDatos({ type: 'HIDRATAR', payload: { items: datosLocales, registros: [] } });
        }
    };

    useEffect(() => {
        obtenerItemsDatos();
    }, [modo]);

    const guardarItem = async (item) => {
        const existe = estadoDatos.lista.some(i => i.id === item.id);

        if (modo === 'api') {
            try {
                if (existe) {
                    await fetch(`${API_URL}/${item.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    });
                    setitemsDatos({ type: 'CAMBIAR_ESTADO', payload: { id: item.id, nuevoEstado: item.estado, fecha: item.fechaActividad } });
                } else {
                    await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    });
                    setitemsDatos({ type: 'AGREGAR', payload: item });
                }
            } catch (error) {
                console.error('Error en la API al guardar:', error);
            }
        } else {
            const todosLosItems = JSON.parse(localStorage.getItem('items') || '[]');
            const indice = todosLosItems.findIndex(i => i.id === item.id);

            if (indice !== -1) {
                todosLosItems[indice] = item;
                setitemsDatos({ type: 'CAMBIAR_ESTADO', payload: { id: item.id, nuevoEstado: item.estado, fecha: item.fechaActividad } });
            } else {
                todosLosItems.unshift(item);
                setitemsDatos({ type: 'AGREGAR', payload: item });
            }
            localStorage.setItem('items', JSON.stringify(todosLosItems));
        }
    };

    const eliminarItem = async (id) => {
        const fecha = new Date().toISOString();
        if (modo === 'api') {
            try {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                setitemsDatos({ type: 'ELIMINAR', payload: { id, fecha } });
            } catch (error) {
                console.error('Error en la API al archivar:', error);
            }
        } else {
            const todosLosItems = JSON.parse(localStorage.getItem('items') || '[]');
            const actualizados = todosLosItems.map(i => i.id === id ? { ...i, activo: 0, fechaActividad: fecha } : i);
            localStorage.setItem('items', JSON.stringify(actualizados));
            setitemsDatos({ type: 'ELIMINAR', payload: { id, fecha } });
        }
    };

    const itemsDatos = useMemo(() => {
        return estadoDatos.lista.filter(item => {
            const esActivo = item.activo === 1 || item.activo === true;

            const categoriaItem = obtenerCategoriaId(item.categoriaId);
            const categoriaFiltro = estadoDatos.filtroCategoria.toLowerCase();
            const estadoItem = (item.estado || '').toLowerCase();
            const estadoFiltro = estadoDatos.filtroEstado.toLowerCase();
            const nombreItem = (item.nombre || '').toLowerCase();
            const busqueda = estadoDatos.busqueda.toLowerCase();

            const cumpleCategoria = categoriaFiltro === 'todas' || categoriaItem === categoriaFiltro;

            const cumpleEstado = estadoFiltro === 'todos' || estadoItem === estadoFiltro;

            const cumpleBusqueda = nombreItem.includes(busqueda);

            return esActivo && cumpleCategoria && cumpleEstado && cumpleBusqueda;
        });
    }, [estadoDatos.lista, estadoDatos.filtroCategoria, estadoDatos.filtroEstado, estadoDatos.busqueda]);

    return (
        <StorageContext.Provider value={{
            modo,
            cambiarModo,
            itemsDatos,
            estadoDatos,
            setitemsDatos,
            guardarItem,
            eliminarItem
        }}>
            {children}
        </StorageContext.Provider>
    );
}