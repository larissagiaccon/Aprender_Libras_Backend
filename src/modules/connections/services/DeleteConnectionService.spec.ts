import 'reflect-metadata';

import DeleteConnectionService from '@servicesConnections/DeleteConnectionService';
import FakeConnectionsRepository from '@fakesRepositoriesConnections/FakeConnectionsRepository';

let deleteConnection: DeleteConnectionService;
let fakeConnectionsRepository: FakeConnectionsRepository;

describe('DeleteConnectionService', () => {
  beforeEach(() => {
    fakeConnectionsRepository = new FakeConnectionsRepository();
    deleteConnection = new DeleteConnectionService(fakeConnectionsRepository);
  });

  it('should be able to delete a connection', async () => {
    fakeConnectionsRepository.create({
      user_id: 'user_id',
      provider_id: 'provider_id',
      socket_id: 'socket_id',
    });

    await deleteConnection.execute('socket_id');
  });
});
