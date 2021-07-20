import { container } from 'tsyringe';

import MessagesRepository from '@repositoriesMessages/MessagesRepository';
import IMessagesRepository from '@interfaceRepositoriesMessages/IMessagesRepository';

container.registerSingleton<IMessagesRepository>(
  'MessagesRepository',
  MessagesRepository,
);
