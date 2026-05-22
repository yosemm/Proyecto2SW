import { createContext, useState, useEffect } from 'react';

export const StorageContext = createContext();

export function StorageProvider({ children }) {

    const [modo, setModo] = useState(
        () => localStorage.getItem('modoDatos') || 'local'
    );

    const [itemsDatos, setitemsDatos] = useState([]);

    const API_URL = '/api/items';

    const cambiarModo = (nuevoModo) => {
        setModo(nuevoModo);
        localStorage.setItem('modoDatos', nuevoModo);
    };

    const obteneritemsDatos = async () => {
        if (modo === 'api') {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const contentType = response.headers.get('content-type') || '';
                if (!contentType.includes('application/json')) {
                    throw new Error('La respuesta no es JSON valido');
                }

                const data = await response.json();
                setitemsDatos(data);
                return data;
            } catch (error) {
                console.error('Error al conectar con la API:', error);
                return [];
            }
        } else {
            const localData = JSON.parse(localStorage.getItem('itemsDatos') || '[]');
            const activos = localData.filter(item => item.activo === true || item.activo === 1);
            setitemsDatos(activos);
            return activos;
        }
    };

    useEffect(() => {
        obteneritemsDatos();
    }, [modo]);

    const guardarItem = async (item) => {
        if (modo === 'api') {
            const existe = itemsDatos.some(i => i.id === item.id);

            try {
                if (existe) {
                    await fetch(`${API_URL}/${item.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    });
                } else {
                    await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    });
                }
            } catch (error) {
                console.error('Error al guardar en la API:', error);
            }
        } else {
            const itemsLocales = JSON.parse(localStorage.getItem('itemsDatos') || '[]');
            const indice = itemsLocales.findIndex(i => i.id === item.id);

            if (indice !== -1) {
                itemsLocales[indice] = { ...itemsLocales[indice], ...item, fechaActividad: new Date().toISOString() };
            } else {
                itemsLocales.unshift(item);
            }
            localStorage.setItem('itemsDatos', JSON.stringify(itemsLocales));
        }

        await obteneritemsDatos();
    };

    const eliminarItem = async (id) => {
        if (modo === 'api') {
            try {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            } catch (error) {
                console.error('Error al archivar en la API:', error);
            }
        } else {
            const itemsLocales = JSON.parse(localStorage.getItem('itemsDatos') || '[]');
            const itemsDatosActualizados = itemsLocales.map(item => {
                if (item.id === id) {
                    return { ...item, activo: 0, fechaActividad: new Date().toISOString() };
                }
                return item;
            });
            localStorage.setItem('itemsDatos', JSON.stringify(itemsDatosActualizados));
        }

        await obteneritemsDatos();
    };

    return (
        <StorageContext.Provider value={{ modo, cambiarModo, itemsDatos, obteneritemsDatos, guardarItem, eliminarItem }}>
            {children}
        </StorageContext.Provider>
    );
}