import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './src/config/database.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import { errorHandler } from './src/middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve os ficheiros estáticos do front-end
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Tratamento global de exceções
app.use(errorHandler);

initDatabase().then((db) => {
  app.locals.db = db;
  app.listen(PORT, () => {
    console.log(`Aplicação completa rodando em http://localhost:${PORT}`);
  });
});