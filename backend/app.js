import express from 'express';
import helmet from 'helmet';
import routerUser from './router/userRouters.js';

const server = express();
const port = 3000;
const baseRequest = '/tasks/api';

server.use(express.json());
server.use(helmet());
server.use(baseRequest + '/user', routerUser);

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});