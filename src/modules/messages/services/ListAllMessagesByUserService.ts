import { inject, injectable } from 'tsyringe';

// import AppError from '@errors/AppError';
import Message from '@entitiesMessages/Message';
import IMessagesRepository from '@interfaceRepositoriesMessages/IMessagesRepository';

@injectable()
export default class ListAllMessagesByUserService {
  constructor(
    @inject('MessagesRepository')
    private messagesRepository: IMessagesRepository,
  ) {}

  public async execute(user_id: string): Promise<Message[]> {
    const list = await this.messagesRepository.listAllMessagesByUser(user_id);

    return list;
  }
}
