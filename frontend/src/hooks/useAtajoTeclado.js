import { useEffect } from 'react';

/**
 * @param {string} tecla Tecla que activa el atajo.
 * @param {Function} callback Funcion que se ejecuta cuando se cumple el atajo.
 * @param {Object} opciones Opciones para pedir Ctrl, Alt o Shift.
 * @returns {void}
 */

export function useAtajoTeclado(tecla, callback, opciones = {}) {
    const {
        requiereCtrl = opciones.ctrl ?? false,
        requiereAlt = opciones.alt ?? false,
        requiereShift = opciones.shift ?? false
    } = opciones;

    useEffect(() => {
        if (!tecla || typeof callback !== 'function') return;

        const handleKeyDown = (e) => {
            const tagName = e.target?.tagName;
            const enInput = tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA';

            if (enInput && !requiereCtrl && !requiereAlt && !requiereShift) return;

            const teclaNormalizada = tecla.toLowerCase();
            const cumpleKey = e.key.toLowerCase() === teclaNormalizada
                || e.code?.toLowerCase() === `key${teclaNormalizada}`;
            const cumpleCtrl = requiereCtrl ? e.ctrlKey : true;
            const cumpleAlt = requiereAlt ? e.altKey : true;
            const cumpleShift = requiereShift ? e.shiftKey : true;

            if (cumpleKey && cumpleCtrl && cumpleAlt && cumpleShift) {
                if (requiereCtrl || requiereAlt || requiereShift) e.preventDefault();
                callback(e);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [tecla, callback, requiereCtrl, requiereAlt, requiereShift]);
}
