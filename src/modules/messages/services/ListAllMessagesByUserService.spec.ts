import 'reflect-metadata';

// import AppError from '@errors/AppError';
import ListAllMessagesByUserService from '@servicesMessages/ListAllMessagesByUserService';
import FakeMessagesRepository from '@fakesRepositoriesMessages/FakeMessagesRepository';

let findMessage: ListAllMessagesByUserService;
let fakeMessagesRepository: FakeMessagesRepository;

describe('ListAllMessagesByUserService', () => {
  beforeEach(() => {
    fakeMessagesRepository = new FakeMessagesRepository();
    findMessage = new ListAllMessagesByUserService(fakeMessagesRepository);
  });

  it('should be able to list all messages by user', async () => {
    fakeMessagesRepository.create({
      user_id: 'user_id',
      provider_id: 'provider_id',
      text: 'text',
    });

    await findMessage.execute('user_id');
  });
});
