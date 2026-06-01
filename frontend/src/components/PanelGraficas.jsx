import { useContext, useMemo } from 'react';
import { StorageContext } from '../context/StorageContext';
import { CATEGORIAS } from '../utils/categorias';
import { obtenerCategoriaId } from '../utils/normalizarCategoria';
import { useEstadoDelJuego } from '../hooks/useEstadoDelJuego';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    PieChart, Pie, Cell,
    LineChart, Line, ResponsiveContainer
} from 'recharts';
import './PanelGraficas.css';

export function PanelGraficas() {
    const { itemsDatos = [] } = useContext(StorageContext) ?? {};
    const items = useMemo(() => Array.isArray(itemsDatos) ? itemsDatos : [], [itemsDatos]);
    const { pendientes, jugando, completados } = useEstadoDelJuego(items);

    const datosActividad = useMemo(() => {
        const dias = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const fechaString = d.toISOString().split('T')[0];
            dias[fechaString] = 0;
        }

        items.forEach(item => {
            if (item.fechaActividad) {
                const fechaKey = item.fechaActividad.split('T')[0];
                if (dias[fechaKey] !== undefined) {
                    dias[fechaKey]++;
                }
            }
        });

        return Object.keys(dias).map(fecha => ({
            fecha: fecha.slice(5),
            "Juegos Modificados": dias[fecha]
        }));
    }, [items]);

    const datosCategorias = useMemo(() => {
        const conteo = {};
        CATEGORIAS.forEach(cat => { conteo[cat.id] = 0; });

        items.forEach(item => {
            const catId = obtenerCategoriaId(item.categoriaId ?? item.categoria);
            if (conteo[catId] !== undefined) {
                conteo[catId]++;
            }
        });

        return CATEGORIAS.map(cat => ({
            name: cat.nombre,
            value: conteo[cat.id],
            color: cat.color || 'var(--color-primary)'
        })).filter(data => data.value > 0);
    }, [items]);

    const datosEstados = useMemo(() => {
        return [
            { name: 'Pendientes', cantidad: pendientes, color: '#e2e8f0' },
            { name: 'Jugando', cantidad: jugando, color: '#bfdbfe' },
            { name: 'Completados', cantidad: completados, color: '#bbf7d0' }
        ];
    }, [pendientes, jugando, completados]);

    if (items.length === 0) return null;

    return (
        <div className="panel-graficas-container">
            <h2>Panel de Analiticas</h2>

            <div className="grafica-card">
                <h3>Actividad en los Ultimos 7 Dias</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={datosActividad}>
                        <XAxis dataKey="fecha" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Juegos Modificados" fill="var(--color-accent)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grafica-card">
                <h3>Distribución por Categoría</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={datosCategorias}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {datosCategorias.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="grafica-card">
                <h3>Estado Actual del Backlog</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={datosEstados}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="cantidad" stroke="var(--color-accent-dark)" strokeWidth={3} name="Videojuegos" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
