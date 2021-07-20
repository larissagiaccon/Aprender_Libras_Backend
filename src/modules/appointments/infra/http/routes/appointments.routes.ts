import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@middlewaresUsers/ensureAuthenticated';
import AppointmentsController from '@controllersAppointments/AppointmentsController';
import ProviderAppointmentsController from '@controllersAppointments/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);

appointmentsRouter.delete('/', appointmentsController.delete);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
