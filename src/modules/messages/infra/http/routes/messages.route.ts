import { Router } from 'express';

import ensureAuthenticated from '@middlewaresUsers/ensureAuthenticated';
import MessagesController from '@controllersMessages/MessagesController';

const messagesRouter = Router();
const messagesController = new MessagesController();

messagesRouter.use(ensureAuthenticated);

messagesRouter.post('/', messagesController.create);
messagesRouter.get('/', messagesController.showByUser);

export default messagesRouter;
