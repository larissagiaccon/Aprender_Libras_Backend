import { inject, injectable } from 'tsyringe';

import Message from '@entitiesMessages/Message';
import IMessagesRepository from '@interfaceRepositoriesMessages/IMessagesRepository';
import ICreateMessageDTO from '@dtosMessages/ICreateMessageDTO';

@injectable()
export default class CreateMessageService {
  constructor(
    @inject('MessagesRepository')
    private messagesRepository: IMessagesRepository,
  ) {}

  public async execute({
    user_id,
    provider_id,
    text,
  }: ICreateMessageDTO): Promise<Message> {
    const message = this.messagesRepository.create({
      user_id,
      provider_id,
      text,
    });

    return message;
  }
}
