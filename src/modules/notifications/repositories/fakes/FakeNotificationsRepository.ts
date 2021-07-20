import { ObjectID } from 'mongodb';

import Notification from '@schemasNotifications/Notification';
import ICreateNotificationtDTO from '@dtosNotifications/ICreateNotificationDTO';
import INotificationsRepository from '@interfaceRepositoriesNotifications/INotificationsRepository';

export default class FakeNotificationsRepository
  implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationtDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    this.notifications.push(notification);

    return notification;
  }
}
