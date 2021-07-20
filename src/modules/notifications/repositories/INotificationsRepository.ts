import Notification from '@schemasNotifications/Notification';
import ICreateNotificationDTO from '@dtosNotifications/ICreateNotificationDTO';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
}
