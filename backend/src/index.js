import express from 'express';
import cors from 'cors';
import conectarDatabase from './db/database.js';
import router from './routes/items.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use(express.json());

async function startServer() {
    try {
        await conectarDatabase();
        console.log('Conectado a la base de datos.');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
}

app.use('/api/items', router);

startServer();