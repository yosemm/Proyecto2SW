export function ItemCard({ juego, archivar, cambiarEstado }) {

    const estadoColores = {
        pendiente: 'grey',
        jugando: 'lightblue',
        completado: 'lightgreen'
    };

    return (
        <div>
            <h3>{juego.nombre}</h3>
            <div>
                <p><strong>Fecha en la que se registró:</strong> {juego.fechaRegistro}</p>
                <p><strong>Categoría:</strong> {juego.categoriaId}</p>
                <p><strong>Estado:</strong> {juego.estado}</p>
                <p><strong>Puntuación:</strong> {juego.puntuacion !== null ? `${juego.puntuacion}/10` : 'Sin puntuar'}</p>
                <p><strong>Notas:</strong> {juego.notas || 'Ninguna'}</p>
            </div>

            <div>
                <button
                    onClick={() => cambiarEstado(juego.id)}
                >
                    Cambiar Estado
                </button>
                <button
                    onClick={() => archivar(juego.id)}
                >
                    Archivar
                </button>
            </div>
        </div>
    );
}