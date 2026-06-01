import { useState, useEffect } from 'react';

/**
 * @param {string} clave Clave usada para guardar y leer el valor.
 * @param {*} valorInicial Valor usado cuando no hay datos guardados.
 * @returns {[*, Function]} Valor guardado y funcion para actualizarlo.
 */

export function useLocalStorage(clave, valorInicial) {
    const [valorGuardado, setValorGuardado] = useState(() => {
        if (!clave) return valorInicial;

        try {
            const item = window.localStorage.getItem(clave);
            return item ? JSON.parse(item) : valorInicial;
        } catch (error) {
            console.error(`No se pudo leer "${clave}" de localStorage:`, error);
            return valorInicial;
        }
    });

    useEffect(() => {
        if (!clave) return;

        try {
            window.localStorage.setItem(clave, JSON.stringify(valorGuardado));
        } catch (error) {
            console.error(`No se pudo guardar "${clave}" en localStorage:`, error);
        }
    }, [clave, valorGuardado]);

    return [valorGuardado, setValorGuardado];
}
