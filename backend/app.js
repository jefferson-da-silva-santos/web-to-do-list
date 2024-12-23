import express from 'express';
import helmet from 'helmet';

const server = express();
const port = 3000;

server.use(express.json());
server.use(helmet());

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});