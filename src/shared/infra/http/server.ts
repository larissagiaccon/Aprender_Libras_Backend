import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import { createConnection } from 'typeorm';

import { server } from './http';
import './websocket/client';

const startServer = async () => {
  server.listen(3333, () => {
    console.log('🚀 Server started on port 3333');
  });
};

createConnection().then(() => startServer());
