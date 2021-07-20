import 'reflect-metadata';

import FindBySocketConnectionService from '@servicesConnections/FindBySocketConnectionService';
import FakeConnectionsRepository from '@fakesRepositoriesConnections/FakeConnectionsRepository';

let findConnection: FindBySocketConnectionService;
let fakeConnectionsRepository: FakeConnectionsRepository;

describe('FindBySocketConnectionService', () => {
  beforeEach(() => {
    fakeConnectionsRepository = new FakeConnectionsRepository();
    findConnection = new FindBySocketConnectionService(
      fakeConnectionsRepository,
    );
  });

  it('should be able to find desc a connection', async () => {
    fakeConnectionsRepository.create({
      user_id: 'user_id',
      provider_id: 'provider_id',
      socket_id: 'socket_id',
    });

    await findConnection.execute('socket_id');
  });
});
