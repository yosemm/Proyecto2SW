import { useContext } from 'react';
import { StorageContext } from '../context/StorageProvider';
import { CATEGORIAS } from '../utils/categorias';

export function ItemCard({ juego }) {

    const infoCategoria = CATEGORIAS.find(cat =>
        cat.id.toLowerCase() === juego.categoriaId?.toLowerCase() ||
        cat.nombre.toLowerCase() === juego.categoriaId?.toLowerCase()
    ) || { emoji: '🎮', color: 'var(--color-text)' };

    const cambiarEstado = () => {
        const ordenEstados = ['pendiente', 'jugando', 'completado'];
        const siguienteIndice = (ordenEstados.indexOf(juego.estado) + 1) % ordenEstados.length;

        const juegoActualizado = {
            ...juego,
            estado: ordenEstados[siguienteIndice],
            fechaActividad: new Date().toISOString()
        };
        guardarItem(juegoActualizado);
    };

    return (
        <div className="item-card" style={{ borderColor: infoCategoria.color }}>
            <h3>{juego.nombre}</h3>
            <div>
                <p><strong>Fecha en la que se registró:</strong> {juego.fechaRegistro}</p>
                <p><strong>Categoría:</strong> {infoCategoria.emoji} {juego.categoriaId}</p>
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