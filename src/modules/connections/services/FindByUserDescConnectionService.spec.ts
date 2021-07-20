import 'reflect-metadata';

import FindByUserDescConnectionService from '@servicesConnections/FindByUserDescConnectionService';
import FakeConnectionsRepository from '@fakesRepositoriesConnections/FakeConnectionsRepository';

let findDescConnection: FindByUserDescConnectionService;
let fakeConnectionsRepository: FakeConnectionsRepository;

describe('FindByUserDescConnectionService', () => {
  beforeEach(() => {
    fakeConnectionsRepository = new FakeConnectionsRepository();
    findDescConnection = new FindByUserDescConnectionService(
      fakeConnectionsRepository,
    );
  });

  it('should be able to find desc a connection', async () => {
    fakeConnectionsRepository.create({
      user_id: 'user_id',
      provider_id: 'provider_id',
      socket_id: 'socket_id',
    });

    await findDescConnection.execute('user_id');
  });
});
