import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@middlewaresUsers/ensureAuthenticated';

import ProfileController from '@controllersUsers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);

profileRouter.delete('/', profileController.delete);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.when('old_password', {
        is: Joi.exist(),
        then: Joi.required(),
      }),
      password_confirmation: Joi.when('password', {
        is: Joi.exist(),
        then: Joi.valid(Joi.ref('password')).required(),
      }),
    },
  }),
  profileController.update,
);

export default profileRouter;
