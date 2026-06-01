import { useCallback, useContext, useState, useRef } from 'react';
import { StorageContext } from '../context/StorageContext';
import { CATEGORIAS } from '../utils/categorias';
import { useAtajoTeclado } from '../hooks/useAtajoTeclado';

export function FormularioItem() {
    const inputNombreRef = useRef(null);

    const enfocarNombre = useCallback(() => {
        inputNombreRef.current?.focus();
    }, []);

    useAtajoTeclado('n', enfocarNombre, { requiereCtrl: true });
    useAtajoTeclado('n', enfocarNombre, { requiereAlt: true });

    const { guardarItem } = useContext(StorageContext);

    const [datos, setDatos] = useState({
        nombre: '',
        categoriaId: CATEGORIAS[0].id,
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

        const nuevoJuego = {
            id: crypto.randomUUID(),
            nombre: datos.nombre,
            categoriaId: datos.categoriaId,
            estado: datos.estado,
            puntuacion: datos.puntuacion ? Number(datos.puntuacion) : null,
            fechaRegistro: new Date().toISOString(),
            fechaActividad: new Date().toISOString(),
            notas: datos.notas,
            atributos: {},
            activo: 1
        };

        guardarItem(nuevoJuego);
        setDatos({
            nombre: '',
            categoriaId: '',
            estado: '',
            puntuacion: '',
            notas: ''
        });

        inputNombreRef.current?.focus();

    };

    return (
        <div className="formulario-item">
            <h2 id="registrar">Registrar Nuevo Juego</h2>
            <form onSubmit={submitInput}>

                <div>
                    <label>Nombre del juego: </label>
                    <input
                        type="text"
                        name="nombre"
                        ref={inputNombreRef}
                        value={datos.nombre}
                        onChange={valorInput}
                        required
                        placeholder="Nombre del juego"
                    />
                </div>

                <div>
                    <label>Categoria: </label>
                    <select name="categoriaId" value={datos.categoriaId} onChange={valorInput} required>
                        <option value="">Seleccione una categoria</option>
                        {CATEGORIAS.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.emoji} {categoria.nombre}
                            </option>
                        ))}
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
                    <label>Puntuacion (0-10): </label>
                    <input
                        type="number"
                        name="puntuacion"
                        min="0"
                        max="10"
                        value={datos.puntuacion}
                        onChange={valorInput}
                        required
                        placeholder="¿Te ha gustado el juego? (0-10)"
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
                        placeholder="Comentarios o detalles sobre el juego"
                    />
                </div>

                <button type="submit">
                    Guardar Juego
                </button>
            </form>
        </div>
    );
}
