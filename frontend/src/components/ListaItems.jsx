import { StorageContext } from '../context/StorageProvider';
import { ItemCard } from './ItemCard';
import { useContext } from 'react';

export function ListaItems() {
    const { itemsDatos } = useContext(StorageContext);

    if (itemsDatos.length === 0) {
        return (
            <div>
                <p>El backlog está vacío.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Mis Juegos ({itemsDatos.length})</h2>
            {itemsDatos.map((juego) => (
                <ItemCard
                    key={juego.id}
                    juego={juego}
                />
            ))}
        </div>
    );
}