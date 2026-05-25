
export const estadoInicial = {
    lista: [],
    registros: [],
    filtroCategoria: 'todas',
    filtroEstado: 'todos',
    busqueda: ''
};

export function itemsReducer(estado, accion) {

    switch (accion.type) {

        case 'HIDRATAR':
            return {
                ...estado,
                lista: accion.payload.items || [],
                registros: accion.payload.registros || []
            };

        case 'AGREGAR':
            return {
                ...estado,
                lista: [accion.payload, ...estado.lista]
            };

        case 'ELIMINAR':
            return {
                ...estado,
                lista: estado.lista.map(item =>
                    item.id === accion.payload.id ? { ...item, activo: 0, fechaActividad: accion.payload.fecha } : item
                )
            };

        case 'CAMBIAR_ESTADO':
            return {
                ...estado,
                lista: estado.lista.map(item =>
                    item.id === accion.payload.id
                        ? { ...item, estado: accion.payload.nuevoEstado, fechaActividad: accion.payload.fecha }
                        : item
                )
            };

        case 'FILTRAR_CATEGORIA':
            return {
                ...estado,
                filtroCategoria: accion.payload
            };

        case 'FILTRAR_ESTADO':
            return {
                ...estado,
                filtroEstado: accion.payload
            };

        case 'SET_BUSQUEDA':
            return {
                ...estado,
                busqueda: accion.payload
            };

        case 'LIMPIAR_FILTROS':
            return {
                ...estado,
                filtroCategoria: 'todas',
                filtroEstado: 'todos',
                busqueda: ''
            };

        case 'REGISTRAR_ACTIVIDAD':
            return {
                ...estado,
                registros: [accion.payload, ...estado.registros]
            };

        default:
            return estado;
    }
}