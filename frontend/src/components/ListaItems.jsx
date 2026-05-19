import { ItemCard } from './ItemCard';

export function ListaItems({ items, archivar, cambiarEstado }) {
    const juegosListados = items.filter(item => item.activo === true);

    if (juegosListados.length === 0) {
        return (
            <div>
                <p>El backlog está vacío.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Mis Juegos ({juegosListados.length})</h2>
            {juegosListados.map((juego) => (
                <ItemCard
                    key={juego.id}
                    juego={juego}
                    archivar={archivar}
                    cambiarEstado={cambiarEstado}
                />
            ))}
        </div>
    );
}