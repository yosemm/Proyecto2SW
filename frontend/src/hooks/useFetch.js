import { useState, useEffect, useCallback } from 'react';

/**
 * @param {string} url Direccion que se consulta con fetch.
 * @returns {Object} Datos, carga, error y funcion para volver a consultar.
 */

export function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(Boolean(url));
    const [error, setError] = useState(null);

    const ejecutarFetch = useCallback(async (signal) => {
        if (!url) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, { signal });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const json = await response.json();
            setData(json);
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Error desconocido');
            }
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [url]);

    useEffect(() => {
        const controller = new AbortController();
        const timerId = setTimeout(() => {
            ejecutarFetch(controller.signal);
        }, 0);

        return () => {
            clearTimeout(timerId);
            controller.abort();
        };
    }, [ejecutarFetch]);

    return { data, loading, error, refetch: () => ejecutarFetch() };
}
