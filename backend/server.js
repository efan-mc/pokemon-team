import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerTeamRoutes } from './src/api/teams.js';

dotenv.config();

const app = express();
const router = express.Router();

app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'] 
}));

app.use(express.json());

router.get('/health', (req, res) => {
  res.status(200).send('Ok');
});

registerTeamRoutes(router);

app.use('/api/v1', router);

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
