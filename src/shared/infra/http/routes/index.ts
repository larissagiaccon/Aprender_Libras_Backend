import { Router } from 'express';

import rateLimiter from '@middlewares/rateLimiter';

import usersRouter from '@routesUsers/users.routes';
import profileRouter from '@routesUsers/profile.routes';
import sessionsRouter from '@routesUsers/sessions.routes';
import passwordRouter from '@routesUsers/password.routes';
import providersRouter from '@routesAppointments/providers.routes';
import appointmentsRouter from '@routesAppointments/appointments.routes';
import messagesRouter from '@routesMessages/messages.route';

const routes = Router();

routes.use('/providers', providersRouter);
routes.use('/appointments', appointmentsRouter);
routes.use('/sessions', sessionsRouter);

routes.use(rateLimiter);
routes.use('/users', usersRouter);
routes.use('/profile', profileRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/chat', messagesRouter);

export default routes;
