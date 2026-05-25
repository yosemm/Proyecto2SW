
export const estadoInicial = {
    lista: [],
    registros: [],
    filtroCategoria: 'todas',
    filtroEstado: 'todos',
    busqueda: ''
};

export function itemsReducer(state, action) {

    switch (action.type) {

        case 'HIDRATAR':
            return {
                ...state,
                lista: action.payload.items || [],
                registros: action.payload.registros || []
            };

        case 'AGREGAR':
            return {
                ...state,
                lista: [action.payload, ...state.lista]
            };

        case 'ELIMINAR':
            return {
                ...state,
                lista: state.lista.map(item =>
                    item.id === action.payload.id ? { ...item, activo: 0, fechaActividad: action.payload.fecha } : item
                )
            };

        case 'CAMBIAR_ESTADO':
            return {
                ...state,
                lista: state.lista.map(item =>
                    item.id === action.payload.id
                        ? { ...item, estado: action.payload.nuevoEstado, fechaActividad: action.payload.fecha }
                        : item
                )
            };

        case 'FILTRAR_CATEGORIA':
            return {
                ...state,
                filtroCategoria: action.payload
            };

        case 'FILTRAR_ESTADO':
            return {
                ...state,
                filtroEstado: action.payload
            };

        case 'SET_BUSQUEDA':
            return {
                ...state,
                busqueda: action.payload
            };

        case 'LIMPIAR_FILTROS':
            return {
                ...state,
                filtroCategoria: 'todas',
                filtroEstado: 'todos',
                busqueda: ''
            };

        case 'REGISTRAR_ACTIVIDAD':
            return {
                ...state,
                registros: [action.payload, ...state.registros]
            };

        default:
            return state;
    }
}