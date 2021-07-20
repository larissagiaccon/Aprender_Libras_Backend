import 'reflect-metadata';

import CreateConnectionService from '@servicesConnections/CreateConnectionService';
import FakeConnectionsRepository from '@fakesRepositoriesConnections/FakeConnectionsRepository';

let createConnection: CreateConnectionService;
let fakeConnectionsRepository: FakeConnectionsRepository;

describe('CreateConnectionService', () => {
  beforeEach(() => {
    fakeConnectionsRepository = new FakeConnectionsRepository();
    createConnection = new CreateConnectionService(fakeConnectionsRepository);
  });

  it('should be able to create a new connection', async () => {
    const connection = await createConnection.execute({
      user_id: 'user_id',
      provider_id: 'provider_id',
      socket_id: 'socket_id',
    });

    expect(connection).toHaveProperty('id');
    expect(connection.user_id).toBe('user_id');
    expect(connection.provider_id).toBe('provider_id');
    expect(connection.socket_id).toBe('socket_id');
  });
});
