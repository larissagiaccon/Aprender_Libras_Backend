import 'reflect-metadata';

// import AppError from '@errors/AppError';
import ListAllLastMessagesByUserService from '@servicesMessages/ListAllLastMessagesByUserService';
import FakeMessagesRepository from '@fakesRepositoriesMessages/FakeMessagesRepository';

let findMessage: ListAllLastMessagesByUserService;
let fakeMessagesRepository: FakeMessagesRepository;

describe('ListAllLastMessagesByUserService', () => {
  beforeEach(() => {
    fakeMessagesRepository = new FakeMessagesRepository();
    findMessage = new ListAllLastMessagesByUserService(fakeMessagesRepository);
  });

  it('should be able to list all last messages by user', async () => {
    fakeMessagesRepository.create({
      user_id: 'user_id',
      provider_id: 'provider_id',
      text: 'text',
    });

    await findMessage.execute('user_id');
  });
});
