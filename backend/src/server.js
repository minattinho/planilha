import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Configuração específica do CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Rotas
app.use('/api/users', usersRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 