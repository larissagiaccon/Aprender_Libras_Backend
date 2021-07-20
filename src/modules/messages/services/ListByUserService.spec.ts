import 'reflect-metadata';

// import AppError from '@errors/AppError';
import ListByUserService from '@servicesMessages/ListByUserService';
import FakeMessagesRepository from '@fakesRepositoriesMessages/FakeMessagesRepository';

let findMessage: ListByUserService;
let fakeMessagesRepository: FakeMessagesRepository;

describe('ListByUserService', () => {
  beforeEach(() => {
    fakeMessagesRepository = new FakeMessagesRepository();
    findMessage = new ListByUserService(fakeMessagesRepository);
  });

  it('should be able to list messages', async () => {
    fakeMessagesRepository.create({
      user_id: 'user_id',
      provider_id: 'provider_id',
      text: 'text',
    });

    await findMessage.execute('user_id', 'provider_id');
  });
});
