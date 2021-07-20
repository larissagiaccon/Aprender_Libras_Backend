import { container } from 'tsyringe';

import NotificationsRepository from '@repositoriesNotifications/NotificationsRepository';
import INotificationsRepository from '@interfaceRepositoriesNotifications/INotificationsRepository';

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
