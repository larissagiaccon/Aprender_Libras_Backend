import 'reflect-metadata';
import '@database/typeorm';
import '@container/index';

import cors from 'cors';
import { errors } from 'celebrate';
import express, { NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import AppError from '@errors/AppError';
import uploadConfig from '@config/upload';

import routes from './routes';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export { server, io };
