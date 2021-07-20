import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@middlewaresUsers/ensureAuthenticated';
import SessionsController from '@controllersUsers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

sessionsRouter.use(ensureAuthenticated);

sessionsRouter.post('/refresh-token', sessionsController.refresh);

export default sessionsRouter;
