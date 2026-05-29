import { useContext, useMemo } from 'react';
import { StorageContext } from '../context/StorageProvider';
import { CATEGORIAS } from '../utils/categorias';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    PieChart, Pie, Cell,
    LineChart, Line, ResponsiveContainer
} from 'recharts';
import './PanelGraficas.css';

export function PanelGraficas() {
    const { itemsDatos = [] } = useContext(StorageContext) ?? {};
    const items = Array.isArray(itemsDatos) ? itemsDatos : [];

    // Grafica 1: Actividad en últimos 7 días
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

    // Grafica 2: Distribución por categoría
    const datosCategorias = useMemo(() => {
        const conteo = {};
        CATEGORIAS.forEach(cat => { conteo[cat.id] = 0; });

        items.forEach(item => {
            const catId = item.categoriaId?.toLowerCase();
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

    // Grafica 3: Distribución por estado de juego
    const datosEstados = useMemo(() => {
        const estados = { pendiente: 0, jugando: 0, completado: 0 };

        items.forEach(item => {
            const est = item.estado?.toLowerCase();
            if (estados[est] !== undefined) {
                estados[est]++;
            }
        });

        return [
            { name: 'Pendientes', cantidad: estados.pendiente, color: '#e2e8f0' },
            { name: 'Jugando', cantidad: estados.jugando, color: '#bfdbfe' },
            { name: 'Completados', cantidad: estados.completado, color: '#bbf7d0' }
        ];
    }, [items]);

    if (items.length === 0) return null;

    return (
        <div className="panel-graficas-container">
            <h2>Panel de Analíticas</h2>

            {/* Grafica 1: Actividad de los últimos 7 días */}
            <div className="grafica-card">
                <h3>Actividad en los Últimos 7 Días</h3>
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

            {/* Grafica 2: Distribución por categorías */}
            <div className="grafica-card">
                <h3>Distribución por Categorías</h3>
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

            {/* Grafica 3: Estado del backlog */}
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