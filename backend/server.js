import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerTeamRoutes } from './src/api/teams.js';
import { registerAnalysisRoutes } from './src/api/analysis.js';
import { registerPokemonRoutes } from './src/api/pokemon.js';

dotenv.config();

const app = express();
const router = express.Router();

app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'Ok' });
});

registerTeamRoutes(router);
registerAnalysisRoutes(router);
registerPokemonRoutes(router);

app.use('/api/v1', router);

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
