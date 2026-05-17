import { useState } from 'react';

export function FormularioItem({ agregarJuego }) {

    const [datos, setDatos] = useState({
        nombre: '',
        categoriaId: '',
        estado: '',
        puntuacion: '',
        notas: ''
    });

    const valorInput = (e) => {
        const { name, value } = e.target;
        setDatos({
            ...datos,
            [name]: value
        });
    };

    const submitInput = (e) => {
        e.preventDefault();
        agregarJuego(datos);
        setDatos({
            nombre: '',
            categoriaId: '',
            estado: '',
            puntuacion: '',
            notas: ''
        });
    };

    return (
        <div>
            <h2>Registrar Nuevo Juego</h2>
            <form onSubmit={submitInput}>

                <div>
                    <label>Nombre del juego: </label>
                    <input
                        type="text"
                        name="nombre"
                        value={datos.nombre}
                        onChange={valorInput}
                        required
                    />
                </div>

                <div>
                    <label>Categoría: </label>
                    <select name="categoriaId" value={datos.categoriaId} onChange={valorInput} required>
                        <option value="">Seleccione una categoría</option>
                        <option value="RPG">RPG</option>
                        <option value="Acción">Acción</option>
                        <option value="Estrategia">Estrategia</option>
                    </select>
                </div>

                <div>
                    <label>Estado: </label>
                    <select name="estado" value={datos.estado} onChange={valorInput} required>
                        <option value="pendiente">Pendiente</option>
                        <option value="jugando">Jugando</option>
                        <option value="completado">Completado</option>
                    </select>
                </div>

                <div>
                    <label>Puntuación (0-10): </label>
                    <input
                        type="number"
                        name="puntuacion"
                        min="0"
                        max="10"
                        value={datos.puntuacion}
                        onChange={valorInput}
                        required
                    />
                </div>

                <div>
                    <label>Notas: </label>
                    <input
                        type="text"
                        name="notas"
                        value={datos.notas}
                        onChange={valorInput}
                        required
                    />
                </div>

                <button type="submit">
                    Guardar Juego
                </button>
            </form>
        </div>
    );
}