import { inject, injectable } from 'tsyringe';

// import AppError from '@errors/AppError';
import Message from '@entitiesMessages/Message';
import IMessagesRepository from '@interfaceRepositoriesMessages/IMessagesRepository';

@injectable()
export default class ListByUserService {
  constructor(
    @inject('MessagesRepository')
    private messagesRepository: IMessagesRepository,
  ) {}

  public async execute(
    user_id: string,
    provider_id: string,
  ): Promise<Message[]> {
    const list = await this.messagesRepository.listByUser(user_id, provider_id);

    return list;
  }
}
