import { StorageContext } from '../context/StorageContext';
import ItemCard from './ItemCard';
import { useContext, useRef, useEffect } from 'react';

export function ListaItems() {
    const { itemsDatos } = useContext(StorageContext);
    const ultimoJuegoRef = useRef(null);

    useEffect(() => {
        ultimoJuegoRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [itemsDatos.length]);

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
            <div className="item-card-contenedor">
                {itemsDatos.map((juego) => (
                    <ItemCard
                        key={juego.id}
                        juego={juego}
                    />
                ))}
            </div>
        </div>
    );
}
