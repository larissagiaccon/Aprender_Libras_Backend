// import { EntityRepository, Repository } from 'typeorm';
// import Message from '@entitiesMessages/Message';

// @EntityRepository(Message)
// export default class MessagesRepository extends Repository<Message> {}

import { getRepository, Repository } from 'typeorm';

import Message from '@entitiesMessages/Message';
import ICreateMessageDTO from '@dtosMessages/ICreateMessageDTO';
import IMessagesRepository from '@interfaceRepositoriesMessages/IMessagesRepository';

export default class MessagesRepository implements IMessagesRepository {
  private ormRepository: Repository<Message>;

  constructor() {
    this.ormRepository = getRepository(Message);
  }

  public async create(messageData: ICreateMessageDTO): Promise<Message> {
    const message = this.ormRepository.create(messageData);

    await this.ormRepository.save(message);

    return message;
  }

  public async listByUser(
    user_id: string,
    provider_id: string,
  ): Promise<Message[]> {
    const userProvider = user_id;
    const providerUser = provider_id;

    const list1 = await this.ormRepository.find({
      where: { user_id, provider_id },
      // relations: ['user'],
    });

    const list2 = await this.ormRepository.find({
      where: { user_id: providerUser, provider_id: userProvider },
      // relations: ['user'],
    });

    const list = list1.concat(list2);

    return list;
  }

  public async listAllMessagesByUser(user_id: string): Promise<Message[]> {
    const list = await this.ormRepository.query(
      `
      SELECT *
      FROM messages
      WHERE user_id = '${user_id}' or provider_id = '${user_id}'
      `,
      [],
    );

    return list;
  }

  public async listAllLastMessagesByUser(user_id: string): Promise<Message[]> {
    const list = await this.ormRepository.query(
      `
      SELECT *
      FROM (
        SELECT *
        FROM messages as msg
        WHERE user_id = '${user_id}' or provider_id = '${user_id}'
      ) as msg
      WHERE created_at = (
                  SELECT max(created_at)
                  FROM messages
                  WHERE provider_id = msg.provider_id
                )
          or created_at = (
                  SELECT max(created_at)
                  FROM messages
                  WHERE user_id = msg.user_id

                )
      ORDER BY created_at DESC
      `,
      [],
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
