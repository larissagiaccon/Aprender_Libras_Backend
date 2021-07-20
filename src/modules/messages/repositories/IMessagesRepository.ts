import Message from '@entitiesMessages/Message';
import ICreateMessageDTO from '@dtosMessages/ICreateMessageDTO';

export default interface IMessagesRepository {
  create(data: ICreateMessageDTO): Promise<Message>;
  listByUser(user_id: string, provider_id: string): Promise<Message[]>;
  listAllLastMessagesByUser(user_id: string): Promise<Message[]>;
  listAllMessagesByUser(user_id: string): Promise<Message[]>;
}
