import { container } from 'tsyringe';

import ConnectionsRepository from '@repositoriesConnections/ConnectionsRepository';
import IConnectionsRepository from '@interfaceRepositoriesConnections/IConnectionsRepository';

container.registerSingleton<IConnectionsRepository>(
  'ConnectionsRepository',
  ConnectionsRepository,
);
