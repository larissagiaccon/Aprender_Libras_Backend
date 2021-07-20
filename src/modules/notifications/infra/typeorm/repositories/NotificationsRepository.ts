import { getMongoRepository, MongoRepository } from 'typeorm';

import Notification from '@schemasNotifications/Notification';
import ICreateNotificationtDTO from '@dtosNotifications/ICreateNotificationDTO';
import INotificationsRepository from '@interfaceRepositoriesNotifications/INotificationsRepository';

export default class NotificationsRepository
  implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationtDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}
