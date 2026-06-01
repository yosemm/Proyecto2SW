import { useMemo } from 'react';

/**
 * @param {Array} items Lista de items con su estado actual.
 * @returns {Object} Totales, conteos por estado, porcentaje completado y mensaje del backlog.
 */

export function useEstadoDelJuego(items = []) {
    return useMemo(() => {
        const lista = Array.isArray(items) ? items : [];
        const total = lista.length;
        const completados = lista.filter(item => item.estado?.toLowerCase() === 'completado').length;
        const jugando = lista.filter(item => item.estado?.toLowerCase() === 'jugando').length;
        const pendientes = lista.filter(item => item.estado?.toLowerCase() === 'pendiente').length;
        const porcentajeCompletado = total > 0 ? Math.round((completados / total) * 100) : 0;
        const mensajeEstado = porcentajeCompletado > 50
            ? 'Buen ritmo de completado.'
            : 'Tu backlog sigue creciendo. Toca jugar.';

        return {
            total,
            totalItems: total,
            completados,
            jugando,
            pendientes,
            porcentajeCompletado,
            mensajeEstado,
            mensajeRacha: mensajeEstado
        };
    }, [items]);
}
