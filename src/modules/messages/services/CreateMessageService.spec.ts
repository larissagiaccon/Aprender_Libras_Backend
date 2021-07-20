import 'reflect-metadata';

// import AppError from '@errors/AppError';
import CreateMessageService from '@servicesMessages/CreateMessageService';
import FakeMessagesRepository from '@fakesRepositoriesMessages/FakeMessagesRepository';

let createMessage: CreateMessageService;
let fakeMessagesRepository: FakeMessagesRepository;

describe('CreateMessageService', () => {
  beforeEach(() => {
    fakeMessagesRepository = new FakeMessagesRepository();
    createMessage = new CreateMessageService(fakeMessagesRepository);
  });

  it('should be able to create a new message', async () => {
    const message = await createMessage.execute({
      user_id: 'user_id',
      provider_id: 'provider_id',
      text: 'text',
    });

    expect(message).toHaveProperty('id');
    expect(message.user_id).toBe('user_id');
    expect(message.provider_id).toBe('provider_id');
    expect(message.text).toBe('text');
  });
});
