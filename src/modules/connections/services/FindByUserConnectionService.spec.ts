import 'reflect-metadata';

import FindByUserConnectionService from '@servicesConnections/FindByUserConnectionService';
import FakeConnectionsRepository from '@fakesRepositoriesConnections/FakeConnectionsRepository';

let findConnection: FindByUserConnectionService;
let fakeConnectionsRepository: FakeConnectionsRepository;

describe('FindByUserConnectionService', () => {
  beforeEach(() => {
    fakeConnectionsRepository = new FakeConnectionsRepository();
    findConnection = new FindByUserConnectionService(fakeConnectionsRepository);
  });

  it('should be able to find a connection', async () => {
    fakeConnectionsRepository.create({
      user_id: 'user_id',
      provider_id: 'provider_id',
      socket_id: 'socket_id',
    });

    await findConnection.execute('user_id');
  });
});
