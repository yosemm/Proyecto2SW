import { useEffect, useReducer, useMemo } from 'react';
import { itemsReducer, estadoInicial } from '../reducers/itemsReducer';
import { obtenerCategoriaId } from '../utils/normalizarCategoria';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { StorageContext } from './StorageContext';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
const API_URL = API_BASE.endsWith('/api/items') ? API_BASE : `${API_BASE}/api/items`;

export function StorageProvider({ children }) {
    const [modo, setModo] = useLocalStorage('modoDatos', 'local');
    const [itemsLocales, setItemsLocales] = useLocalStorage('items', []);
    const [estadoDatos, setitemsDatos] = useReducer(itemsReducer, estadoInicial);

    useEffect(() => {
        const cargarDatos = async () => {
            if (modo === 'api') {
                try {
                    const response = await fetch(API_URL);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const itemsAPI = await response.json();
                    setitemsDatos({ type: 'HIDRATAR', payload: { items: itemsAPI, registros: [] } });
                } catch (error) {
                    console.error('Error al conectar con la API:', error);
                }
            } else {
                setitemsDatos({ type: 'HIDRATAR', payload: { items: itemsLocales, registros: [] } });
            }
        };
        cargarDatos();
    }, [modo]);

    const guardarItem = async (item) => {
        const existe = estadoDatos.lista.some(i => i.id === item.id);
        const action = existe 
            ? { type: 'CAMBIAR_ESTADO', payload: { id: item.id, nuevoEstado: item.estado, fecha: item.fechaActividad } }
            : { type: 'AGREGAR', payload: item };

        if (modo === 'api') {
            try {
                await fetch(existe ? `${API_URL}/${item.id}` : API_URL, {
                    method: existe ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });
                setitemsDatos(action);
            } catch (error) {
                console.error('Error en la API al guardar:', error);
            }
        } else {
            const nuevosItems = existe
                ? itemsLocales.map(i => i.id === item.id ? item : i)
                : [item, ...itemsLocales];

            setItemsLocales(nuevosItems);
            setitemsDatos(action);
        }
    };

    const eliminarItem = async (id) => {
        const fecha = new Date().toISOString();
        const action = { type: 'ELIMINAR', payload: { id, fecha } };

        if (modo === 'api') {
            try {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                setitemsDatos(action);
            } catch (error) {
                console.error('Error en la API al eliminar:', error);
            }
        } else {
            const actualizados = itemsLocales.map(i => i.id === id ? { ...i, activo: 0, fechaActividad: fecha } : i);
            setItemsLocales(actualizados);
            setitemsDatos(action);
        }
    };

    const itemsDatos = useMemo(() => {
        const catFiltro = estadoDatos.filtroCategoria.toLowerCase();
        const estFiltro = estadoDatos.filtroEstado.toLowerCase();
        const busquedaFiltro = estadoDatos.busqueda.toLowerCase();

        return estadoDatos.lista.filter(item => {
            const esActivo = item.activo === 1 || item.activo === true;
            if (!esActivo) return false;

            const cumpleCategoria = catFiltro === 'todas' || obtenerCategoriaId(item.categoriaId) === catFiltro;
            const cumpleEstado = estFiltro === 'todos' || (item.estado || '').toLowerCase() === estFiltro;
            const cumpleBusqueda = (item.nombre || '').toLowerCase().includes(busquedaFiltro);

            return cumpleCategoria && cumpleEstado && cumpleBusqueda;
        });
    }, [estadoDatos.lista, estadoDatos.filtroCategoria, estadoDatos.filtroEstado, estadoDatos.busqueda]);

    return (
        <StorageContext.Provider value={{
            modo,
            cambiarModo: setModo,
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
