import { v4 as uuid } from 'uuid';

import Message from '@entitiesMessages/Message';
import ICreateMessageDTO from '@dtosMessages/ICreateMessageDTO';
import IMessagesRepository from '@interfaceRepositoriesMessages/IMessagesRepository';

export default class FakeMessagesRepository implements IMessagesRepository {
  private messages: Message[] = [];

  public async create(messageData: ICreateMessageDTO): Promise<Message> {
    const message = new Message();

    Object.assign(message, { id: uuid() }, messageData);

    this.messages.push(message);

    return message;
  }

  public async listByUser(
    user_id: string,
    provider_id: string,
  ): Promise<Message[]> {
    const userProvider = user_id;
    const providerUser = provider_id;

    const list1 = this.messages.filter(
      message =>
        message.user_id === user_id && message.provider_id === provider_id,
    );

    const list2 = this.messages.filter(
      message =>
        message.user_id === providerUser &&
        message.provider_id === userProvider,
    );

    const list = list1.concat(list2);

    return list;
  }

  public async listAllMessagesByUser(user_id: string): Promise<Message[]> {
    const list = this.messages.filter(
      message => message.user_id === user_id && message.provider_id === user_id,
    );

    return list;
  }

  public async listAllLastMessagesByUser(user_id: string): Promise<Message[]> {
    const list = await this.messages.filter(
      message => message.user_id === user_id && message.provider_id === user_id,
    );

    const listFormatted = list.map(msg => {
      let last;
      if (msg.user_id === user_id) {
        last = msg.provider_id;
      }
      if (msg.user_id !== user_id) {
        last = msg.user_id;
      }

      return {
        ...msg,
        last,
      };
    });

    const listLastFormatted: Message[] = listFormatted.filter((msg1, i) => {
      return !listFormatted.some((msg2, j) => j < i && msg1.last === msg2.last);
    });

    return listLastFormatted;
  }
}
